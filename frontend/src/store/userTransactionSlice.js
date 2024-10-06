import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to get all transactions
export const getTransactions = createAsyncThunk('transactions/getTransactions', async ({token}, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:3004/api/transactions/',{
            headers: {
                'Authorization': `Bearer ${token}`
              }
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Thunk to get user-specific transactions
export const getUserTransactions = createAsyncThunk('transactions/getUserTransactions', async ({userId,token}, thunkAPI) => {
    try {
        console.log("hakiii: ",userId);
        const response = await axios.get(`http://localhost:3004/api/transactions/user/${userId}`,{
            headers: {
                'Authorization': `Bearer ${token}`
              }
        });
        console.log("hakiii",response.data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Thunk to create a new transaction
export const createTransaction = createAsyncThunk('transactions/createTransaction', async ({transactionData, token }, thunkAPI) => {
    try {
        console.log(token)
        const response = await axios.post('http://localhost:3004/api/transactions/', transactionData, {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Initial state
const initialState = {
    transactions: [],
    userTransactions: [],
    loading: false,
    error: null,
};

// Transaction slice
const userTransactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Handle getTransactions
        builder
            .addCase(getTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Handle getUserTransactions
        builder
            .addCase(getUserTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.userTransactions = action.payload;
            })
            .addCase(getUserTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Handle createTransaction
        builder
            .addCase(createTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions.push(action.payload); 
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userTransactionSlice.reducer;
