import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainPage from "./pages/main";
import Web3Provider from "./context/web3.context";
import {Box} from "@chakra-ui/react";

function App() {
  return (
    <Web3Provider>
      <Box
        as='header'
        position='absolute'
        top='0'
        left='0'
        zIndex='10'
        backgroundColor='teal'
        width='100%'
        padding='20px'
      >
        My App
      </Box>

      <Box paddingTop='100px'>
        <MainPage/>
      </Box>
    </Web3Provider>
  );
}

export default App;
