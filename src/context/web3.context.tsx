import React, {
  createContext, useCallback, useEffect, useMemo, useState,
} from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { networkConfig, TNetworkConfig } from '../config';
import { CoinEnum } from '../enum/coin.enum';
import { bnbConfig, ethConfig } from '../utils/web3';

type Web3ContextType = {
  web3: Web3 | null;
  accounts: Array<string>;
  network: number | null;
  networkType: TNetworkConfig | null;
  handleSetNetworkType(network: TNetworkConfig): void;
  accountBalance: string | null;
  currentCurrencySymbol: CoinEnum | string | null
};

export const Web3Context = createContext<Web3ContextType>({
  web3: null,
  accounts: [],
  network: null,
  networkType: null,
  accountBalance: null,
  currentCurrencySymbol: null,
  handleSetNetworkType: () => undefined,
});

const Web3Provider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3ContextType['web3']>(null);
  const [accounts, setAccounts] = useState<Web3ContextType['accounts']>([]);
  const [network, setNetwork] = useState<Web3ContextType['network']>(null);
  const [networkType, setNetworkType] = useState<Web3ContextType['networkType']>(null);
  const [accountBalance, setAccountBalance] = useState<Web3ContextType['accountBalance']>(null);

  const changeNetwork = async (chainId: number) => {
    const neededNetwork = networkConfig.find((x) => x.chainId === chainId);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3?.utils.toHex(chainId) }],
      });
    } catch (err) {
      // This error code indicates that the chain has not been added to MetaMask
      if ((err as any).code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: neededNetwork?.chainName,
              chainId: web3?.utils.toHex(chainId),
              rpcUrls: [neededNetwork?.rpcUrl],
            },
          ],
        });
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

          const instance = new Web3(window.ethereum);

          await changeNetwork(networkType?.chainId as number);

          switch (networkType?.networkType) {
            case CoinEnum.ETH:
              instance.setProvider(ethConfig.rpcUrl);
              break;
            case CoinEnum.BNB:
              instance.setProvider(bnbConfig.rpcUrl);
              break;
            default:
              // eslint-disable-next-line no-console
              console.error('Unsupported network.');
              return;
          }

          const networkId = await instance.eth.net.getId();

          setNetwork(networkId);
          setWeb3(instance);
          setAccounts(accounts);

          // eslint-disable-next-line no-console
          console.log('Connected to MetaMask. Current account:', accounts[0]);
        } else {
          // eslint-disable-next-line no-console
          console.error('MetaMask extension not found.');
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to connect to MetaMask:', e);
      }
    };

    if (networkType) {
      init();
    }
  }, [networkType]);

  const handleSetNetworkType = useCallback((network: TNetworkConfig) => {
    setNetworkType(network);
  }, []);

  useEffect(() => {
    const getBalance = async () => {
      const provider = new ethers.providers.JsonRpcProvider(web3?.bzz.currentProvider);
      const balance = await provider.getBalance(accounts[0]);
      const balanceInEther = ethers.utils.formatEther(balance);

      setAccountBalance(balanceInEther);
    };

    if (accounts.length) {
      getBalance();
    }
  }, [accounts, web3?.bzz.currentProvider]);

  const currentCurrencySymbol = useMemo(() => {
    switch (web3?.bzz.currentProvider) {
      case ethConfig.rpcUrl:
        return CoinEnum.ETH;
      case bnbConfig.rpcUrl:
        return CoinEnum.BNB;
      default:
        return '';
    }
  }, [web3?.bzz.currentProvider]);

  const contextValue = useMemo(() => ({
    web3,
    accounts,
    network,
    handleSetNetworkType,
    networkType,
    accountBalance,
    currentCurrencySymbol,
  }), [
    web3,
    accounts,
    network,
    handleSetNetworkType,
    networkType,
    accountBalance,
    currentCurrencySymbol,
  ]);

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
