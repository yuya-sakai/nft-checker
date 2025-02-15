// pages/check.js
import { useState } from 'react';
import dynamic from 'next/dynamic';

// react-qr-reader を動的に読み込む
const QrReader = dynamic(
  () =>
    import('react-qr-reader').then((mod) => mod.default || mod.QrReader),
  { ssr: false }
);

export default function CheckPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  // カメラの向きを制御するステート。初期値は外側（environment）に設定
  const [cameraMode, setCameraMode] = useState("environment");

  const handleScan = (data) => {
    if (data) {
      console.log("QRコードデータ:", data);
      setWalletAddress(data);
      setScanning(false);
    }
  };

  const handleError = (err) => {
    console.error("QRリーダーエラー:", err);
    setError('QRコードの読み取りに失敗しました');
  };

  // カメラの向きを切り替える関数
  const toggleCamera = () => {
    setCameraMode((prevMode) => (prevMode === "environment" ? "user" : "environment"));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>NFT 保有確認</h1>
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
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setScanning(!scanning)}>
          {scanning ? 'QRコードスキャンを停止' : 'QRコードスキャンを開始'}
        </button>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={toggleCamera}>
          カメラ切替（現在: {cameraMode === "environment" ? "外側" : "内側"}）
        </button>
      </div>
      {scanning && (
        <div style={{ width: '300px', height: '300px', marginBottom: '1rem' }}>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
            videoConstraints={{
              facingMode: cameraMode // cameraMode に応じたカメラを使用
            }}
          />
        </div>
      )}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => { /* 検証用の関数をここに追加 */ }}>
          検証
        </button>
      </div>
      {result && (
        <div style={{ color: result === '保有' ? 'blue' : 'red', fontWeight: 'bold' }}>
          {result}
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
