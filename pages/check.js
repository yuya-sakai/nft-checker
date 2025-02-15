// pages/check.js
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// react-qr-scanner をクライアントサイドのみ読み込む（SSR無効）
const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });

export default function CheckPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  // スキャン開始時に利用可能なビデオデバイスを列挙し、外側カメラを選択する
  useEffect(() => {
    if (scanning) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          // ビデオ入力デバイスのみ抽出
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
            // 見つからなければ、最初のデバイスを使用（環境によってはこちらが外側の場合もある）
            setSelectedDeviceId(videoDevices[0].deviceId);
          }
        })
        .catch((err) => {
          console.error('Error enumerating devices:', err);
          setError('カメラデバイスの取得に失敗しました');
        });
    }
  }, [scanning]);

  // QRコードの読み取り結果を処理する
  const handleScan = (data) => {
    if (data) {
      console.log('QRコードデータ:', data);
      // data の形式はライブラリによって異なるため、文字列かオブジェクトかで処理
      if (typeof data === 'string') {
        setWalletAddress(data);
      } else if (data.text) {
        setWalletAddress(data.text);
      }
      setScanning(false);
    }
  };

  // エラー処理
  const handleError = (err) => {
    console.error('QR Scanner Error:', err);
    setError('QRコードの読み取りに失敗しました');
  };

  // スキャンの開始/停止を切り替える
  const toggleScanning = () => {
    setScanning(!scanning);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>NFT 保有確認</h1>
      
      {/* ウォレットアドレス入力欄 */}
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

      {/* スキャン開始/停止ボタン */}
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
            // selectedDeviceId が取得できた場合は deviceId を指定
            videoConstraints={
              selectedDeviceId
                ? { deviceId: { exact: selectedDeviceId } }
                : { facingMode: 'environment' }
            }
          />
        </div>
      )}

      {/* エラー表示 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
