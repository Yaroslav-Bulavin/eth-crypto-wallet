import React, { useContext, useMemo } from 'react';

import {
  Box, Button, Card, CardBody, Flex, Text,
} from '@chakra-ui/react';
import { Web3Context } from '../../context/web3.context';
import ERC20Contract from '../../components/ERC20Contract';
import SendCrypto from '../../components/SendCrypto';

function MainPage() {
  const {
    handleSetNetworkType, accounts, accountBalance, networkType,
  } = useContext(Web3Context);
  const connectToMetaMask = async (network: any) => {
    handleSetNetworkType(network);
  };

  const networkTypeToDisplay = useMemo(() => {
    switch (networkType) {
      case 'eth':
        return 'Connected to ETH Mainnet';
      case 'bsc':
        return 'Connected to BSC Testnet';
      default:
        return 'the network has not been selected';
    }
  }, [networkType]);

  return (
    <Flex w="100%" height="100vh" direction="column" justify="center" align="center">
      <Card>
        <CardBody>
          <Flex justifyContent="center">
            <Button onClick={() => connectToMetaMask('eth')} mr="10px">Connect to ETH Mainnet</Button>
            <Button onClick={() => connectToMetaMask('bsc')}>Connect to BSC Testnet</Button>
          </Flex>

          <Box>
            <Box textAlign="center" w="100%" fontSize="18px" fontWeight="700">Wallet info</Box>
            <Flex>
              <Text as="b">Network type:</Text>
              <Text>{networkTypeToDisplay || '-----'}</Text>
            </Flex>
            <Flex>
              <Text as="b">Wallet address:</Text>
              <Text>{accounts[0] || '-----'}</Text>
            </Flex>
            <Flex>
              <Text as="b">Actual balance:</Text>
              <Text>{accountBalance || '-----'}</Text>
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
