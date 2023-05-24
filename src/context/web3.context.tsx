import React, {createContext, useState, useEffect, useCallback, useMemo} from 'react';
import Web3 from 'web3';
import {bscConfig, ethereumConfig} from "../config";
import {ethers} from "ethers";

type Web3ContextType = {
  web3: Web3 | null;
  accounts: Array<string>;
  network: number | null;
  networkType: string | null;
  handleSetNetworkType(network: string): void;
  accountBalance: string | null;
}

// Create the Web3 context
export const Web3Context = createContext<Web3ContextType>({
  web3: null,
  accounts: [],
  network: null,
  networkType: null,
  accountBalance: null,
  handleSetNetworkType: (network: string) => undefined
});

const Web3Provider: React.FC<{children?: React.ReactNode}> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3ContextType['web3']>(null);
  const [accounts, setAccounts] = useState<Web3ContextType['accounts']>([]);
  const [network, setNetwork] = useState<Web3ContextType['network']>(null);
  const [networkType, setNetworkType] = useState<Web3ContextType['networkType']>(null);
  const [accountBalance, setAccountBalance] = useState<Web3ContextType['networkType']>(null);

  useEffect(() => {
    console.log('web3', web3)
    console.log('accounts', accounts)
    console.log('network', network)
    console.log('balance', accountBalance)
    console.log('networkType', networkType)
  }, [web3, accounts, network, accountBalance, networkType])

  useEffect(() => {
    const init = async (networkURL: string) => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          // Request access to the user's MetaMask accounts
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

          // Create a new instance of Web3 using MetaMask provider
          const instance = new Web3(window.ethereum);

          switch (networkURL) {
            case 'eth':
              instance.setProvider(ethereumConfig.rpcUrl);
              break;
            case 'bsc':
              instance.setProvider(bscConfig.rpcUrl);
              break;
            default:
              console.error('Unsupported network.');
              return;
          }

          const networkId = await instance.eth.net.getId();

          setNetwork(networkId);
          setWeb3(instance);
          setAccounts(accounts);

          console.log('Connected to MetaMask. Current account:', accounts[0]);
        } else {
          console.error('MetaMask extension not found.');
        }
      } catch (e) {
        console.error('Failed to connect to MetaMask:', e);
      }
    };

    if (networkType) {
      init(networkType);
    }
  }, [networkType])

  const handleSetNetworkType = useCallback((network: string) => {
    setNetworkType(network)
  }, [])

  useEffect(() => {
    const getBalance = async () => {
      const provider = new ethers.providers.JsonRpcProvider(web3?.bzz.currentProvider)
      const balance = await provider.getBalance(accounts[0]);
      const balanceInEther = ethers.utils.formatEther(balance);

      console.log(`Account balance: ${balanceInEther} ETH`);

      setAccountBalance(balanceInEther);
    };

    if (accounts.length) {
      getBalance();
    }
  }, [accounts, networkType, web3?.bzz.currentProvider])

  return (
    <Web3Context.Provider value={{
      web3,
      accounts,
      network,
      handleSetNetworkType,
      networkType,
      accountBalance,
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;