// pages/check.js
import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

export default function CheckPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [stream, setStream] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [result, setResult] = useState(''); // NFT検証結果
  const [scanning, setScanning] = useState(false);
  const [qrScanningInterval, setQrScanningInterval] = useState(null);

  // カメラの初期化
  const initCamera = async () => {
    try {
      // まずカメラアクセス許可を取得して一度ストリームを作成
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
      tempStream.getTracks().forEach((track) => track.stop());

      // ビデオデバイスの列挙
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');

      // ラベルに "back", "rear", "後面", "リア" を含むデバイスがあればそれを使う
      const rearCamera = videoDevices.find((device) => {
        const label = device.label.toLowerCase();
        return (
          label.includes('back') ||
          label.includes('rear') ||
          label.includes('後面') ||
          label.includes('リア')
        );
      });

      let constraints;
      if (rearCamera) {
        setSelectedDeviceId(rearCamera.deviceId);
        constraints = { video: { deviceId: { exact: rearCamera.deviceId } } };
      } else {
        // 見つからない場合は environment (外側カメラ) を厳密に要求
        constraints = { video: { facingMode: { exact: 'environment' } } };
      }

      // 再度 getUserMedia
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      setError('カメラの初期化に失敗しました: ' + err.message);
    }
  };

  // QRコード読み取り開始
  const startQRScanning = () => {
    setScanning(true);
    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          console.log('QRコード検出:', code.data);
          let scannedData = code.data;

          // ":"以前を削除
          if (scannedData.includes(':')) {
            scannedData = scannedData.substring(scannedData.indexOf(':') + 1);
          }
          // "@"以降を削除
          if (scannedData.includes('@')) {
            scannedData = scannedData.split('@')[0];
          }

          setWalletAddress(scannedData);
          clearInterval(interval);
          setQrScanningInterval(null);
          setScanning(false);
        }
      }
    }, 500);
    setQrScanningInterval(interval);
  };

  // QRコード読み取り停止
  const stopQRScanning = () => {
    if (qrScanningInterval) {
      clearInterval(qrScanningInterval);
      setQrScanningInterval(null);
    }
    setScanning(false);
  };

  // NFT保有検証
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
        // ownsNFT が true なら青文字「保有」、false なら赤文字「未保有」
        setResult(data.ownsNFT ? '保有' : '未保有');
      } else {
        setError(`エラー: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setError('検証中にエラーが発生しました');
    }
  };

  // リセットボタン
  const handleReset = () => {
    setWalletAddress('');
    setResult('');
    setError('');
  };

  // 初回マウント時にカメラを初期化
  useEffect(() => {
    initCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (qrScanningInterval) {
        clearInterval(qrScanningInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>NFT 保有確認</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '300px', height: '300px', background: '#000' }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ marginTop: '1rem' }}>
        <button onClick={initCamera}>カメラ再初期化</button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={startQRScanning}>QRコード読み取り開始</button>
        <button onClick={stopQRScanning}>QRコード読み取り停止</button>
      </div>
      <div style={{ marginTop: '1rem' }}>
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
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleReset}>リセット</button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleVerify}>検証</button>
      </div>

      {result && (
        <div
          style={{
            marginTop: '1rem',
            color: result === '保有' ? 'blue' : 'red',
            fontWeight: 'bold'
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}
