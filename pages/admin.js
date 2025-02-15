// pages/admin.js
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [networkName, setNetworkName] = useState('');
  const [rpcEndpoint, setRpcEndpoint] = useState('');
  const [chainId, setChainId] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [message, setMessage] = useState('');

  // 初回マウント時に現在の設定を取得
  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setNetworkName(data.networkName || '');
      setRpcEndpoint(data.rpcEndpoint || '');
      setChainId(data.chainId || '');
      setContractAddress(data.contractAddress || '');
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ networkName, rpcEndpoint, chainId, contractAddress }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('設定が保存されました');
    } else {
      setMessage(`エラー: ${data.error}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>NFT 検証設定</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Network Name:{' '}
            <input
              type="text"
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
              placeholder="例: Ethereum Mainnet"
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            RPC Endpoint:{' '}
            <input
              type="text"
              value={rpcEndpoint}
              onChange={(e) => setRpcEndpoint(e.target.value)}
              placeholder="例: https://mainnet.infura.io/v3/your-api-key"
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Chain ID:{' '}
            <input
              type="number"
              value={chainId}
              onChange={(e) => setChainId(e.target.value)}
              placeholder="例: 1"
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            NFT Contract Address:{' '}
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="例: 0x..."
            />
          </label>
        </div>
        <button type="submit">決定</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
