// pages/api/settings.js
import config from '../../config';

export default function handler(req, res) {
  if (req.method === 'GET') {
    // 現在の設定情報を返す
    res.status(200).json(config);
  } else if (req.method === 'POST') {
    const { networkName, rpcEndpoint, chainId, contractAddress } = req.body;
    if (!networkName || !rpcEndpoint || !chainId || !contractAddress) {
      return res.status(400).json({ error: 'networkName, rpcEndpoint, chainId, contractAddress は必須です' });
    }
    // 設定を更新
    config.networkName = networkName;
    config.rpcEndpoint = rpcEndpoint;
    config.chainId = chainId;
    config.contractAddress = contractAddress;
    res.status(200).json({ message: '設定が保存されました' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
