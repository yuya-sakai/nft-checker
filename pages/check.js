// pages/check.js
import { useState } from 'react';
import dynamic from 'next/dynamic';

// react-qr-scanner を SSR 無効で動的にインポート
const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });

export default function CheckPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [cameraMode, setCameraMode] = useState("environment");

  // react-qr-scanner の初期設定用スタイル（プレビューサイズなど）
  const previewStyle = {
    height: 300,
    width: 300,
  };

  // QRコード読み取り時の処理
  const handleScan = (data) => {
    if (data) {
      console.log("QRコードデータ:", data);
      // data の形式はライブラリによって異なる場合があるため、適宜変換してください
      // ここでは、data が文字列の場合とオブジェクトの場合を仮定
      if (typeof data === "string") {
        setWalletAddress(data);
      } else if (data.text) {
        setWalletAddress(data.text);
      }
      setScanning(false);
    }
  };

  // エラー時の処理
  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
    setError("QRコードの読み取りに失敗しました");
  };

  // カメラ切替用の処理
  const toggleCamera = () => {
    setCameraMode((prevMode) => (prevMode === "environment" ? "user" : "environment"));
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
      
      {/* QRコードスキャンの開始/停止ボタン */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setScanning(!scanning)}>
          {scanning ? 'QRコードスキャンを停止' : 'QRコードスキャンを開始'}
        </button>
      </div>
      
      {/* カメラ切替ボタン */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={toggleCamera}>
          カメラ切替（現在: {cameraMode === "environment" ? "外側" : "内側"}）
        </button>
      </div>
      
      {/* QRコードスキャナー */}
      {scanning && (
        <div style={{ marginBottom: '1rem' }}>
          <QrScanner
            onError={handleError}
            onScan={handleScan}
            style={previewStyle}
            facingMode={cameraMode} // facingMode をカメラモードに合わせる
          />
        </div>
      )}

      {/* エラー表示 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
