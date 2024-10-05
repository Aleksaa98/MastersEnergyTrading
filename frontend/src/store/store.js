import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import batteryReducer from './batterySlice'
import userTransactionReducer from './userTransactionSlice'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root', 
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  transactions: userTransactionReducer,
  battery: batteryReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);

export default store;
