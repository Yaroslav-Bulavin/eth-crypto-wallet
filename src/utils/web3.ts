import Web3 from 'web3';
import { ethereumConfig, bscConfig } from '../config';
import {ethers} from "ethers";

export const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    // Check if the user has MetaMask installed
    if ((window as any).ethereum) {
      const web3 = new Web3((window as any).ethereum);
      resolve(web3);
    } else {
      reject(new Error('MetaMask is not installed.'));
    }
  });
};

export const getNetworkId = async (web3: any) => {
  const networkId = await web3.eth.net.getId();
  console.log(networkId)
  return networkId;
};

export const getNetworkConfig = (networkId: number) => {
  if (networkId === 1) {
    return ethereumConfig;
  } else if (networkId === 97) {
    return bscConfig;
  } else {
    throw new Error('Unsupported network.');
  }
};

export const connectToNetwork = async () => {
  const web3 = await getWeb3();
  const networkId = await getNetworkId(web3);
  const networkConfig = getNetworkConfig(networkId);
  (web3 as any).setProvider(networkConfig.rpcUrl);
  return web3;
};

export const getAccounts = async (network: any) => {
  try {
    // Check if MetaMask is installed
    if (window.ethereum) {
      // Request access to the user's MetaMask accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log(accounts)

      // Create a new instance of Web3 using MetaMask provider
      const web3 = new Web3(window.ethereum);
      // Now you can use the web3 instance to interact with Ethereum

      // Set the provider based on the selected network
      switch (network) {
        case 'eth':
          web3.setProvider(ethereumConfig.rpcUrl);
          break;
        case 'bsc':
          web3.setProvider(bscConfig.rpcUrl);
          break;
        default:
          console.error('Unsupported network.');
          return;
      }
      console.log(web3)
      // Example: Get the current account address
      const address = accounts[0];
      console.log('Connected to MetaMask. Current account:', address);

      // Perform additional operations or update your React component state accordingly
      return accounts;
    } else {
      console.error('MetaMask is not installed.');
    }
  } catch (error) {
    console.error('Failed to connect to MetaMask:', error);
  }
}

export const getBalance = async (address: string, providerUrl: string) => {
  try {
    // Create a provider using the specified URL
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);

    // Get the account balance
    const balance = await provider.getBalance(address);
    // Convert the balance to a readable format (e.g., Ether)
    const balanceInEther = ethers.utils.formatEther(balance);

    console.log(`Account balance: ${balanceInEther} ETH`);
  } catch (error) {
    console.error('Failed to get account balance:', error);
  }
};

export const CHRABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"bytes32"},{"name":"value","type":"uint256"}],"name":"transferToChromia","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newMinter","type":"address"}],"name":"changeMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"DECIMALS","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isMinter","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"},{"name":"refID","type":"bytes32"}],"name":"transferFromChromia","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"minter","type":"address"},{"name":"initialBalance","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"TransferToChromia","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"refID","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"TransferFromChromia","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];