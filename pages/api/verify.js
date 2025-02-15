// pages/api/verify.js
import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ error: 'ウォレットアドレスが必要です' });
  }

  // 環境変数を取得
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
  const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
  const nftContractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

  // 必須の環境変数がセットされているかチェック
  if (!chainId || !rpcEndpoint || !nftContractAddress) {
    return res.status(500).json({ error: '環境変数の設定が不十分です' });
  }

  try {
    // ethers.js で RPC エンドポイント + チェーンID を指定してプロバイダーを作成
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, chainId);

    // ERC1155 の ABI (balanceOf)
    const erc1155Abi = [
      'function balanceOf(address account, uint256 id) view returns (uint256)'
    ];
    const contract = new ethers.Contract(nftContractAddress, erc1155Abi, provider);

    // 例として tokenId = 1 をチェック
    const tokenId = 1;
    const balance = await contract.balanceOf(walletAddress, tokenId);
    const ownsNFT = balance.gt(0);

    return res.status(200).json({ ownsNFT });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.toString() });
  }
}
