// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to NFT Checker</h1>
      <p>This is the home page.</p>
      <Link href="/check">
        <a style={{ color: 'blue', textDecoration: 'underline' }}>
          NFT 保有確認ページへ移動
        </a>
      </Link>
    </div>
  );
}
