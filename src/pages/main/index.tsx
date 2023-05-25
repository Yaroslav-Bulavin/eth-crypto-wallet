import React, { useContext, useMemo } from 'react';

import {
  Box, Button, Card, CardBody, Flex, Text,
} from '@chakra-ui/react';
import { Web3Context } from '../../context/web3.context';
import ERC20Contract from '../../components/ERC20Contract';
import SendCrypto from '../../components/SendCrypto';
import { bscConfig, ethereumConfig } from '../../config';
import LazyText from '../../elements/LazyText';

function MainPage() {
  const {
    handleSetNetworkType, accounts, accountBalance, networkType,
  } = useContext(Web3Context);
  const connectToMetaMask = async (network: typeof ethereumConfig) => {
    handleSetNetworkType(network);
  };

  const networkTypeToDisplay = useMemo(() => {
    switch (networkType?.networkType) {
      case 'eth':
        return 'Connected to ETH Mainnet';
      case 'bsc':
        return 'Connected to BSC Testnet';
      default:
        return null;
    }
  }, [networkType]);

  return (
    <Flex w="100%" height="100vh" direction="column" justify="center" align="center">
      <Card>
        <CardBody>
          <Flex justifyContent="center">
            <Button onClick={() => connectToMetaMask(ethereumConfig)} mr="10px">Connect to ETH Mainnet</Button>
            <Button onClick={() => connectToMetaMask(bscConfig)}>Connect to BSC Testnet</Button>
          </Flex>

          <Box>
            <Box textAlign="center" w="100%" fontSize="18px" fontWeight="700">Wallet info</Box>
            <Flex align="center">
              <Text as="b">Network type:</Text>
              <LazyText text={networkTypeToDisplay} />
            </Flex>
            <Flex align="center">
              <Text as="b">Wallet address:</Text>
              <LazyText text={accounts[0]} />
            </Flex>
            <Flex align="center">
              <Text as="b">Actual balance:</Text>
              <LazyText text={accountBalance} />
            </Flex>
          </Box>

          <ERC20Contract />

          <SendCrypto />
        </CardBody>
      </Card>
    </Flex>
  );
}

export default MainPage;
