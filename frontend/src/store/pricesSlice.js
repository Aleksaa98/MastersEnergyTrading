// src/redux/pricesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AIApiInstance } from '../../src/axiosConfig'; // Axios instance for microservice-trade on port 3001


export const fetchPricesData = createAsyncThunk('price/fetchPrices', async () => {
    const response = await AIApiInstance.get('/prices');
    return response.data;
});

export const fetchPredictedPrices = createAsyncThunk('price/fetchPredicted', async () => {
    const response = await AIApiInstance.get('/predict');
    return response.data;
});

const pricesSlice = createSlice({
  name: 'prices',
  initialState: {
    actual: [],
    predicted: [],
    predicted24: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPricesData.fulfilled, (state, action) => {
      console.log('✅ fetchPricesData.fulfilled → payload:', action.payload); 

      state.actual = action.payload.actual;
      state.predicted = action.payload.predicted;
    });

    builder.addCase(fetchPredictedPrices.fulfilled, (state, action) => {
        console.log('✅ fetchPredictedPrices.fulfilled → payload:', action.payload); 

        const { prices, timestamps } = action.payload;

        state.predicted24 = timestamps.map((ts, i) => ({
            price: parseFloat(prices[i].toFixed(1)), // optional rounding
            timestamp: ts
        }));
    });

    // Optional: log errors if needed
    builder.addCase(fetchPricesData.rejected, (state, action) => {
      console.error('❌ fetchPricesData.rejected →', action.error);
    });

    builder.addCase(fetchPricesData.pending, () => {
      console.log('⏳ fetchPricesData.pending...');
    });

    builder.addCase(fetchPredictedPrices.rejected, (state, action) => {
      console.error('❌ fetchPredictedPrices.rejected →', action.error);
    });

    builder.addCase(fetchPredictedPrices.pending, () => {
      console.log('⏳ fetchPredictedPrices.pending...');
    });
  }
});

export default pricesSlice.reducer;
