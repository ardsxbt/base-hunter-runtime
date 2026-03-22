import { ethers } from 'ethers';
import { config } from './config';

export type TActiveChain = 'base' | 'unichain';

export function getActiveChain(): TActiveChain {
  return config.ACTIVE_CHAIN;
}

export function getActiveChainId(): number {
  return getActiveChain() === 'unichain' ? config.UNICHAIN_CHAIN_ID : config.BASE_CHAIN_ID;
}

export function getActiveRpcUrl(): string {
  if (getActiveChain() === 'unichain') {
    if (!config.UNICHAIN_RPC_URL)
      throw new Error('UNICHAIN_RPC_URL missing while ACTIVE_CHAIN=unichain');
    return config.UNICHAIN_RPC_URL;
  }
  return config.BASE_MAINET_RPC_URL;
}

export function getActiveProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(getActiveRpcUrl());
}
