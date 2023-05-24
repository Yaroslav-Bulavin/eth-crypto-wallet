import React, {useContext, useEffect, useState} from 'react';
import {Web3Context} from "../../context/web3.context";
import {CHRABI} from "../../utils/web3";
import Web3 from "web3";
import {ethers} from "ethers";
import {Box, Flex, Text} from "@chakra-ui/react";

const ERC20Contract: React.FC<{tokenAddress?: string}> = ({ tokenAddress = '0x8A2279d4A90B6fe1C4B30fa660cC9f926797bAA2' }) => {
  const { web3 } = useContext(Web3Context);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(0);

  useEffect(() => {
    const loadTokenContract = async () => {
      try {
        // Load the ERC20 contract using the contract's ABI and address
         // Replace with the actual ABI of the ERC20 contract
        const provider = new ethers.providers.JsonRpcProvider(web3?.bzz.currentProvider);
        const contract = new ethers.Contract(tokenAddress, CHRABI, provider);
        console.log(contract)
        setTokenContract(contract);
        console.log(await contract.name())
        // Retrieve token details
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();

        setTokenName(name);
        setTokenSymbol(symbol);
        setTokenDecimals(decimals);
      } catch (error) {
        console.error('Error loading ERC20 token:', error);
      }
    };

    if (web3 && tokenAddress) {
      loadTokenContract();
    }
  }, [web3, tokenAddress]);

  return (
    <Box>
      <Box textAlign='center' w='100%' fontSize='18px' fontWeight='700'>ERC20 Token Details</Box>
      <Flex>
        <Text as='b'>Name:</Text>
        <Text>{tokenName || '-----'}</Text>
      </Flex>
      <Flex>
        <Text as='b'>Symbol:</Text>
        <Text>{tokenSymbol || '-----'}</Text>
      </Flex>
      <Flex>
        <Text as='b'>Decimals:</Text>
        <Text>{tokenDecimals || '-----'}</Text>
      </Flex>
    </Box>
  );
};

export default ERC20Contract;