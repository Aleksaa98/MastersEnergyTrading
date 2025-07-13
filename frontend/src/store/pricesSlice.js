// src/redux/pricesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AIApiInstance } from '../../src/axiosConfig'; // Axios instance for microservice-trade on port 3001


export const fetchPricesData = createAsyncThunk('price/fetchPrices', async () => {
    const response = await AIApiInstance.get('/prices');
    return response.data;
});

const pricesSlice = createSlice({
  name: 'prices',
  initialState: {
    actual: [],
    predicted: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPricesData.fulfilled, (state, action) => {
      console.log('✅ fetchPricesData.fulfilled → payload:', action.payload); 

      state.actual = action.payload.actual;
      state.predicted = action.payload.predicted;
    });

    // Optional: log errors if needed
    builder.addCase(fetchPricesData.rejected, (state, action) => {
      console.error('❌ fetchPricesData.rejected →', action.error);
    });

    builder.addCase(fetchPricesData.pending, () => {
      console.log('⏳ fetchPricesData.pending...');
    });
  }
});

export default pricesSlice.reducer;
