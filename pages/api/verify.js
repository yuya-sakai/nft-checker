// pages/api/verify.js
import { ethers } from 'ethers';
import config from '../../config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ error: 'ウォレットアドレスが必要です' });
  }

  try {
    // プロバイダーを設定
    const provider = new ethers.providers.JsonRpcProvider(
      config.rpcEndpoint,
      config.chainId
    );

    // ERC-1155 の balanceOfBatch 関数を利用するための最小限の ABI
    const erc1155Abi = [
      "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])"
    ];

    const contract = new ethers.Contract(config.contractAddress, erc1155Abi, provider);

    // 例として token ID 0～100 をチェックする
    const maxTokenId = 100;  // 必要に応じて変更してください
    const tokenIds = Array.from({ length: maxTokenId + 1 }, (_, i) => i);
    const accounts = Array(tokenIds.length).fill(walletAddress);

    // バッチで各 token ID の残高を取得
    const balances = await contract.balanceOfBatch(accounts, tokenIds);

    // 残高が1以上のトークンがあれば、NFT 保有と判断する
    const ownsNFT = balances.some(balance => balance.gt(0));

    res.status(200).json({ ownsNFT });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
}
