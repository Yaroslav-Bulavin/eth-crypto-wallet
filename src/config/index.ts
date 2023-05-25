import { CoinEnum } from '../enum/coin.enum';

export type TNetworkConfig = {
  network: string;
  rpcUrl: string;
  chainId: number;
  chainName: string;
  networkType: CoinEnum;
};

export const networkConfig: TNetworkConfig[] = [
  {
    network: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/c2457f302ac74d2086a2eecbdb6547dd',
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    networkType: CoinEnum.ETH,
  },
  {
    network: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    chainId: 56,
    chainName: 'BNB Smart Chain',
    networkType: CoinEnum.BNB,
  },
];
