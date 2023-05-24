import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Box, Button, Flex} from "@chakra-ui/react";
import {connectToNetwork, getBalance} from "../../utils/web3";
import Web3 from "web3";
import {bscConfig, ethereumConfig} from "../../config";
import {Web3Context} from "../../context/web3.context";
import * as net from "net";
import ERC20Contract from "../../components/ERC20Contract";

const MainPage = () => {
  const {handleSetNetworkType, accounts, accountBalance, networkType} = useContext(Web3Context);
  const connectToMetaMask = async (network: any) => {
    handleSetNetworkType(network)
  };

  const networkTypeToDisplay = useMemo(() => {
    switch (networkType) {
      case 'eth':
        return 'Connected to ETH Mainnet'
      case 'bsc':
        return 'Connected to BSC Testnet'
      default:
        return 'the network has not been selected'
    }
  }, [networkType])

  return (
    <Box>
      <Flex justifyContent='center'>
        <Button onClick={() => connectToMetaMask('eth')} mr='10px'>Connect to ETH Mainnet</Button>
        <Button onClick={() => connectToMetaMask('bsc')}>Connect to BSC Testnet</Button>
      </Flex>

      <Box>
        <Flex>
          <Box>Network type:</Box>
          <Box>{networkTypeToDisplay}</Box>
        </Flex>
        <Flex>
          <Box>Wallet address:</Box>
          <Box>{accounts[0]}</Box>
        </Flex>
        <Flex>
          <Box>Actual balance:</Box>
          <Box>{accountBalance}</Box>
        </Flex>
      </Box>

      <ERC20Contract/>

    </Box>
  );
};

export default MainPage;