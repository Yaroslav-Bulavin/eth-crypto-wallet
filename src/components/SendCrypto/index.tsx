import React, { useContext, useState } from 'react';
import { ethers } from 'ethers';
import {
  Box, Button, FormControl, FormLabel, Input, useToast,
} from '@chakra-ui/react';
import { Web3Context } from '../../context/web3.context';

function SendCrypto() {
  const toast = useToast();
  const { accounts, currentCurrencySymbol } = useContext(Web3Context);

  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    try {
      if (!receiverAddress || !amount || parseFloat(amount) <= 0) {
        toast({
          title: 'Please provide a valid receiver address and amount.',
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
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

      toast({
        title: 'Transaction successful',
        description: `Transaction hash: ${txn}`,
        status: 'success',
        duration: 10000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: `Error sending cryptocurrencies: ${error.message}`,
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
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
            value={currentCurrencySymbol || 'Your coin'}
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
    </Box>
  );
}

export default SendCrypto;
