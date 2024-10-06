import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tradeApiInstance } from '../../src/axiosConfig'; // Axios instance for microservice-trade on port 3003

export const fetchBatteries = createAsyncThunk('battery/fetchBatteries', async (token) => {
    const response = await tradeApiInstance.get('/battery', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
});

export const fetchBatteryById = createAsyncThunk('battery/fetchBatteryById', async ({ batteryId, token }) => {
    const response = await tradeApiInstance.get(`/battery/${batteryId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
});

export const fetchUserBatteries = createAsyncThunk('battery/fetchUserBatteries', async ({ userId, token }) => {
    const response = await tradeApiInstance.get(`/battery/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
});

export const createBattery = createAsyncThunk('battery/createBattery', async ({ batteryData, token }) => {
    const response = await tradeApiInstance.post('/battery', batteryData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
});

export const updateBattery = createAsyncThunk('battery/updateBattery', async ({ batteryId, updateData, token }) => {
    console.log(batteryId);
    const response = await tradeApiInstance.patch(`/battery/${batteryId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log(response)
    return response.data;
});

export const deleteBattery = createAsyncThunk('battery/deleteBattery', async ({ batteryId, token }) => {
    await tradeApiInstance.delete(`/battery/${batteryId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return batteryId;
});

const initialState = {
    batteries: [],
    battery: null,
    userBatteries: [],
    loading: false,
    error: null,
};

const batterySlice = createSlice({
    name: 'battery',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBatteries.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBatteries.fulfilled, (state, action) => {
                state.batteries = action.payload;
                state.loading = false;
            })
            .addCase(fetchBatteries.rejected, (state, action) => {
                state.error = action.error.message;
                state.batteries = [];
                state.loading = false;
            })

            .addCase(fetchBatteryById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBatteryById.fulfilled, (state, action) => {
                state.battery = action.payload;
                state.loading = false;
            })
            .addCase(fetchBatteryById.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })

            .addCase(fetchUserBatteries.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserBatteries.fulfilled, (state, action) => {
                state.userBatteries = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserBatteries.rejected, (state, action) => {
                state.error = action.error.message;
                state.userBatteries = [];
                state.loading = false;
            })

            .addCase(createBattery.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBattery.fulfilled, (state, action) => {
                state.batteries.push(action.payload);
                state.loading = false;
            })
            .addCase(createBattery.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })

            .addCase(updateBattery.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBattery.fulfilled, (state, action) => {
                const index = state.batteries.findIndex(battery => battery._id === action.payload._id);
                if (index !== -1) {
                    state.batteries[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateBattery.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })

            .addCase(deleteBattery.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBattery.fulfilled, (state, action) => {
                state.batteries = state.batteries.filter(battery => battery._id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteBattery.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            });
    },
});

export default batterySlice.reducer;
