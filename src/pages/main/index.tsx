import React, { useContext, useMemo } from 'react';

import {
  Box, Button, Card, CardBody, Flex, Text,
} from '@chakra-ui/react';
import { Web3Context } from '../../context/web3.context';
import ERC20Contract from '../../components/ERC20Contract';
import SendCrypto from '../../components/SendCrypto';
import {
  TNetworkConfig,
} from '../../config';
import LazyText from '../../elements/LazyText';
import { CoinEnum } from '../../enum/coin.enum';
import { bnbConfig, ethConfig } from '../../utils/web3';

function MainPage() {
  const {
    handleSetNetworkType, accounts, accountBalance, networkType, currentCurrencySymbol,
  } = useContext(Web3Context);
  const connectToMetaMask = async (network: TNetworkConfig) => {
    handleSetNetworkType(network);
  };

  const networkTypeToDisplay = useMemo(() => {
    switch (networkType?.networkType) {
      case CoinEnum.ETH:
        return 'Connected to ETH Mainnet';
      case CoinEnum.BNB:
        return 'Connected to BNB Mainnet';
      default:
        return null;
    }
  }, [networkType]);

  return (
    <Flex w="100%" height="100vh" direction="column" justify="center" align="center">
      <Card width="100%" maxWidth="550px">
        <CardBody>
          <Flex justifyContent="center">
            <Button
              onClick={() => connectToMetaMask(ethConfig)}
              mr="10px"
            >
              ETH Mainnet
            </Button>
            <Button onClick={() => connectToMetaMask(bnbConfig)}>
              BSC Testnet
            </Button>
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
              <LazyText text={accountBalance && currentCurrencySymbol
                ? `${accountBalance} ${currentCurrencySymbol}`
                : null}
              />
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
