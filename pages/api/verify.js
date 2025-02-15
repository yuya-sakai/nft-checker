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

  // 環境変数から設定を取得
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
  const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
  const nftContractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
  const tokenIdsString = process.env.NEXT_PUBLIC_TOKEN_IDS; // 例: "0,1,2"

  if (!chainId || !rpcEndpoint || !nftContractAddress || !tokenIdsString) {
    return res.status(500).json({ error: '環境変数の設定が不十分です' });
  }

  // カンマ区切りの文字列をパースして数値の配列に変換する
  const tokenIds = tokenIdsString.split(',').map((id) => Number(id.trim()));

  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, chainId);
    // ERC1155のbalanceOfBatchを使用して複数のトークンIDをチェックする
    const erc1155Abi = [
      "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])"
    ];
    const contract = new ethers.Contract(nftContractAddress, erc1155Abi, provider);

    // 各tokenIdについてウォレットの残高を取得するため、ウォレットアドレスを繰り返す
    const addresses = tokenIds.map(() => walletAddress);
    const balances = await contract.balanceOfBatch(addresses, tokenIds);

    // 1つでも残高が1以上あれば保有とみなす
    const ownsNFT = balances.some(balance => balance.gt(0));

    return res.status(200).json({ ownsNFT });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.toString() });
  }
}
