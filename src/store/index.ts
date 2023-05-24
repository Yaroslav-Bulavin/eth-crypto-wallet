import { configureStore } from '@reduxjs/toolkit'
import cryptoWalletReducer from "./slices/cryptoWallet.slice";

export default configureStore({
  reducer: {
    cryptoWallet: cryptoWalletReducer
  }
})