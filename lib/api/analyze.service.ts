import axios from 'axios';

export interface IAnalyzeResult {
  tokenAddress: string;
  score: number;
  decision: 'BUY' | 'WATCH' | 'SKIP';
  breakdown: {
    liquidity: number;
    verification: number;
    metadata: number;
    marketBehavior: number;
  };
  risks: string[];
}

export async function analyzeToken(tokenAddress: string): Promise<IAnalyzeResult> {
  const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
  const res = await axios.get(url, { timeout: 8000 });
  const pairs = res.data?.pairs;

  if (!Array.isArray(pairs) || pairs.length === 0) {
    return {
      tokenAddress,
      score: 0,
      decision: 'SKIP',
      breakdown: { liquidity: 0, verification: 0, metadata: 0, marketBehavior: 0 },
      risks: ['no dex pairs found'],
    };
  }

  const pair = pairs.find((p: any) => p.chainId === 'base') || pairs[0];
  const liquidityUsd = Number(pair?.liquidity?.usd || 0);
  const volume24 = Number(pair?.volume?.h24 || 0);
  const buys = Number(pair?.txns?.h24?.buys || 0);
  const sells = Number(pair?.txns?.h24?.sells || 0);
  const priceChange = Number(pair?.priceChange?.h24 || 0);

  let liquidity = 0;
  if (liquidityUsd >= 1000 && liquidityUsd <= 100000) liquidity = 40;

  const verification = 0; // unknown at API-only path

  const baseToken = pair?.baseToken || {};
  const metadata = baseToken?.name && baseToken?.symbol ? 10 : 0;

  let marketBehavior = 0;
  if (volume24 >= 5000) marketBehavior += 10;
  const ratio = buys / Math.max(1, sells);
  if (ratio >= 0.7) marketBehavior += 5;
  if (priceChange > -35 && priceChange < 300) marketBehavior += 5;

  const score = liquidity + verification + metadata + marketBehavior;
  const decision: 'BUY' | 'WATCH' | 'SKIP' = score >= 70 ? 'BUY' : score >= 50 ? 'WATCH' : 'SKIP';

  const risks: string[] = [];
  if (liquidity === 0) risks.push('liquidity out of preferred range');
  if (volume24 < 5000) risks.push('low 24h volume');
  if (ratio < 0.7) risks.push('weak buy/sell ratio');

  return {
    tokenAddress,
    score,
    decision,
    breakdown: { liquidity, verification, metadata, marketBehavior },
    risks,
  };
}
