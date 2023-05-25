import React, {
  createContext, useState, useEffect, useCallback, useMemo,
} from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { bscConfig, ethereumConfig } from '../config';

type Web3ContextType = {
  web3: Web3 | null;
  accounts: Array<string>;
  network: number | null;
  networkType: typeof ethereumConfig | null;
  handleSetNetworkType(network: typeof ethereumConfig): void;
  accountBalance: string | null;
};

export const Web3Context = createContext<Web3ContextType>({
  web3: null,
  accounts: [],
  network: null,
  networkType: null,
  accountBalance: null,
  handleSetNetworkType: () => undefined,
});

const Web3Provider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3ContextType['web3']>(null);
  const [accounts, setAccounts] = useState<Web3ContextType['accounts']>([]);
  const [network, setNetwork] = useState<Web3ContextType['network']>(null);
  const [networkType, setNetworkType] = useState<Web3ContextType['networkType']>(null);
  const [accountBalance, setAccountBalance] = useState<Web3ContextType['accountBalance']>(null);

  const changeNetwork = async (chainId: number) => {
    const neededNetwork = chainId === ethereumConfig.chainId ? ethereumConfig : bscConfig;
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
              chainName: neededNetwork.chainName,
              chainId: web3?.utils.toHex(chainId),
              rpcUrls: [neededNetwork.rpcUrl],
            },
          ],
        });
      }
    }
  };

  useEffect(() => {
    const init = async (networkConfig: Web3ContextType['networkType']) => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          // Request access to the user's MetaMask accounts
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

          // Create a new instance of Web3 using MetaMask provider
          const instance = new Web3(window.ethereum);

          await changeNetwork(networkConfig?.chainId as number);

          switch (networkConfig?.networkType) {
            case 'eth':
              instance.setProvider(ethereumConfig.rpcUrl);
              break;
            case 'bsc':
              instance.setProvider(bscConfig.rpcUrl);
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
      init(networkType);
    }
  }, [networkType]);

  const handleSetNetworkType = useCallback((network: typeof ethereumConfig) => {
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

  const contextValue = useMemo(() => ({
    web3,
    accounts,
    network,
    handleSetNetworkType,
    networkType,
    accountBalance,
  }), [
    web3,
    accounts,
    network,
    handleSetNetworkType,
    networkType,
    accountBalance,
  ]);

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
