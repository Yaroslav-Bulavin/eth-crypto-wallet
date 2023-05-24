import React, {useState} from 'react';
import { ethers } from 'ethers';
import {Box, Button, FormControl, FormLabel, Input, Select, Text} from "@chakra-ui/react";

const SendCrypto = () => {
  const [currency, setCurrency] = useState('ETH');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    try {
      // Validate form inputs
      if (!receiverAddress || !amount || parseFloat(amount) <= 0) {
        setResponseMessage('Please provide a valid receiver address and amount.');
        return;
      }

      // Send cryptocurrencies
      const provider = ethers.getDefaultProvider('mainnet'); // Use the desired Ethereum network
      const wallet = ethers.Wallet.createRandom().connect(provider); // Replace with your own wallet
      const transaction = await wallet.sendTransaction({
        to: receiverAddress,
        value: ethers.utils.parseEther(amount),
      });

      setResponseMessage(`Transaction successful. Transaction hash: ${transaction.hash}`);
    } catch (error) {
      if (error instanceof Error) {
        setResponseMessage(`Error sending cryptocurrencies: ${error.message}`);
      }
    }
  };

  return (
    <Box>
      <Box textAlign='center' w='100%' fontSize='18px' fontWeight='700'>Send crypto</Box>

      <form onSubmit={handleFormSubmit}>
        <FormControl mb='5px'>
          <FormLabel fontWeight='700'>Currency:</FormLabel>
          <Select placeholder='Select currency' value={currency} onChange={(e) => setCurrency(e.target.value)} size='sm'>
            <option value='ETH'>ETH</option>
            <option value='CHR'>CHR</option>
          </Select>
        </FormControl>

        <FormControl mb='5px'>
          <FormLabel fontWeight='700'>Receiver Wallet Address:</FormLabel>
          <Input
            size='sm'
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
        </FormControl>

        <FormControl mb='5px'>
          <FormLabel fontWeight='700'>Amount:</FormLabel>
          <Input
            size='sm'
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormControl>

        <Button type="submit" mt='10px'>Send Cryptocurrencies</Button>
      </form>

      {responseMessage && <Text>{responseMessage}</Text>}
    </Box>
  );
};

export default SendCrypto;