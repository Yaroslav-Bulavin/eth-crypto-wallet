import React, { useContext, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import {
  Box, Button, FormControl, FormLabel, Input, Text,
} from '@chakra-ui/react';
import { Web3Context } from '../../context/web3.context';
import { bscConfig, ethereumConfig } from '../../config';

function SendCrypto() {
  const { accounts, web3 } = useContext(Web3Context);

  const defaultCurrency = useMemo(() => {
    switch (web3?.bzz.currentProvider) {
      case ethereumConfig.rpcUrl:
        return 'ETH';
      case bscConfig.rpcUrl:
        return 'BNB';
      default:
        return 'No coin';
    }
  }, [web3?.bzz.currentProvider]);

  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    try {
      if (!receiverAddress || !amount || parseFloat(amount) <= 0) {
        setResponseMessage('Please provide a valid receiver address and amount.');
        return;
      }

      const params = [{
        from: accounts[0],
        to: receiverAddress,
        value: ethers.utils.parseEther(amount)._hex,
      }];

      const txn = await window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params,
        });

      setResponseMessage(`Transaction successful. Transaction hash: ${txn}`);
    } catch (error) {
      if (error instanceof Error) {
        setResponseMessage(`Error sending cryptocurrencies: ${error.message}`);
      }
    }
  };

  return (
    <Box>
      <Box textAlign="center" w="100%" fontSize="18px" fontWeight="700">Send crypto</Box>

      <form onSubmit={handleFormSubmit}>
        <FormControl mb="5px">
          <FormLabel fontWeight="700">Coin:</FormLabel>
          <Input
            isDisabled
            isReadOnly
            size="sm"
            value={defaultCurrency || 'Your coin'}
          />
        </FormControl>

        <FormControl mb="5px">
          <FormLabel fontWeight="700">Receiver Wallet Address:</FormLabel>
          <Input
            size="sm"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
        </FormControl>

        <FormControl mb="5px">
          <FormLabel fontWeight="700">Amount:</FormLabel>
          <Input
            size="sm"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormControl>

        <Button type="submit" mt="10px">Send Cryptocurrencies</Button>
      </form>

      {responseMessage && <Text>{responseMessage}</Text>}
    </Box>
  );
}

export default SendCrypto;
