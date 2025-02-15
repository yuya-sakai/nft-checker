import { useState } from 'react';
import dynamic from 'next/dynamic';

// react-qr-reader のエクスポート方法に対応するため、default または QrReader を取得する
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
      setWalletAddress(data);
      setScanning(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('QRコードの読み取りに失敗しました');
  };

  const handleVerify = async () => {
    setError('');
    setResult(null);
    if (!walletAddress) {
      setError('ウォレットアドレスを入力してください');
      return;
    }
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress }),
    });
    const data = await res.json();
    if (res.ok) {
      setResult(data.ownsNFT ? '保有' : '未保有');
    } else {
      setError(`エラー: ${data.error}`);
    }
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
          />
        </div>
      )}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleVerify}>検証</button>
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
