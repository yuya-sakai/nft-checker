// pages/check.js
import { useState } from 'react';
import dynamic from 'next/dynamic';

// 動的インポートで react-qr-reader を読み込み
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
      {scanning && (
        <div style={{ width: '300px', height: '300px', marginBottom: '1rem' }}>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
            videoConstraints={{
              facingMode: { exact: "environment" }  // ここで外側（リア）のカメラを指定
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
