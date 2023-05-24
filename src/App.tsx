import React from 'react';
import './App.css';
import MainPage from './pages/main';
import Web3Provider from './context/web3.context';

function App() {
  return (
    <Web3Provider>
      <MainPage />
    </Web3Provider>
  );
}

export default App;
