import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosConfig'; // Import axios configuration

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const response = await axios.post('/user/login', userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await axios.post('/user/register', userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async ({ username, userData, token }, thunkAPI) => {
      try {
        console.log(token);
        const response = await axios.patch(`/users/${username}`, userData, {
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

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        status: 'idle',
        error: null
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.status = 'idle';
        },
        resetStatus(state) {
            state.status = 'idle'; 
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'registered';
            })
            .addCase(register.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateProfile.fulfilled, (state, action) =>{
                state.status = 'updated';
                state.user = action.payload;
            })
    }
});

export const { logout, resetStatus } = authSlice.actions;
export default authSlice.reducer;
