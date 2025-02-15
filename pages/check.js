// pages/check.js
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// react-qr-scanner をクライアント側のみ読み込む（SSR無効）
const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });

export default function CheckPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [result, setResult] = useState(''); // NFT検証結果

  // スキャン開始時に利用可能なビデオデバイスを列挙し、外側カメラ（リアカメラ）の deviceId を取得
  useEffect(() => {
    if (scanning) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput'
          );
          // ラベルに "back" または "rear" が含まれるデバイスを探す
          const rearCamera = videoDevices.find((device) => {
            const label = device.label.toLowerCase();
            return label.includes('back') || label.includes('rear');
          });
          if (rearCamera) {
            setSelectedDeviceId(rearCamera.deviceId);
          } else if (videoDevices.length > 0) {
            // 見つからなければ最初のデバイスを使用
            setSelectedDeviceId(videoDevices[0].deviceId);
          }
        })
        .catch((err) => {
          console.error('Error enumerating devices:', err);
          setError('カメラデバイスの取得に失敗しました');
        });
    }
  }, [scanning]);

  // QRコード読み取り結果の処理
  const handleScan = (data) => {
    if (data) {
      console.log('QRコードデータ:', data);
      if (typeof data === 'string') {
        setWalletAddress(data);
      } else if (data.text) {
        setWalletAddress(data.text);
      }
      setScanning(false);
    }
  };

  // エラー時の処理
  const handleError = (err) => {
    console.error('QR Scanner Error:', err);
    setError('QRコードの読み取りに失敗しました');
  };

  // スキャンの開始/停止の切替
  const toggleScanning = () => {
    setScanning(!scanning);
  };

  // 検証ボタン押下時：APIに問い合わせ、NFT保有状況に応じて結果を表示
  const handleVerify = async () => {
    if (!walletAddress) {
      setError('ウォレットアドレスを入力してください');
      return;
    }
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });
      const data = await res.json();
      if (res.ok) {
        // NFTを保有している場合は「保有」、そうでなければ「未保有」
        setResult(data.ownsNFT ? '保有' : '未保有');
      } else {
        setError(`エラー: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setError('検証中にエラーが発生しました');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>NFT 保有確認</h1>
      
      {/* ウォレットアドレス入力 */}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          ウォレットアドレス:{' '}
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="ウォレットアドレスを入力"
            style={{ width: '300px' }}
          />
        </label>
      </div>

      {/* QRコードスキャン開始/停止ボタン */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={toggleScanning}>
          {scanning ? 'QRコードスキャンを停止' : 'QRコードスキャンを開始'}
        </button>
      </div>

      {/* QRコードスキャナー */}
      {scanning && (
        <div style={{ width: '300px', height: '300px', marginBottom: '1rem' }}>
          <QrScanner
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', height: '100%' }}
            videoConstraints={
              selectedDeviceId
                ? { deviceId: { exact: selectedDeviceId } }
                : { facingMode: 'environment' }
            }
          />
        </div>
      )}

      {/* 検証ボタン */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleVerify}>検証</button>
      </div>

      {/* 結果表示：NFT保有なら青文字、「保有」、保有していなければ赤文字で「未保有」 */}
      {result && (
        <div style={{ color: result === '保有' ? 'blue' : 'red', fontWeight: 'bold' }}>
          {result}
        </div>
      )}

      {/* エラー表示 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
