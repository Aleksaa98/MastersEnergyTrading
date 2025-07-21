import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from '../../src/axiosConfig';

export const fetchWallet = createAsyncThunk(
    'wallet/fetchWallet',
    async (token, thunkAPI) => {
        try {
            const response = await apiInstance.get('/users/profile/wallet', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        balance: 0,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWallet.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWallet.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.balance = action.payload.balance;
            })
            .addCase(fetchWallet.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export default walletSlice.reducer;
