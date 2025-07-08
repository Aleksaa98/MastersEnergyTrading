import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tradeApiInstance } from "../../src/axiosConfig"; // Axios instance for microservice-trade on port 3003

const handleAsyncThunk = (builder, thunk, onFulfilled) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      onFulfilled(state, action);
      state.loading = false;
    })
    .addCase(thunk.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
};

export const fetchBatteries = createAsyncThunk("battery/fetchBatteries", async (token) => {
  const response = await tradeApiInstance.get("/battery", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

export const fetchBatteryById = createAsyncThunk("battery/fetchBatteryById", async ({ batteryId, token }) => {
  const response = await tradeApiInstance.get(`/battery/${batteryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

export const fetchUserBatteries = createAsyncThunk("battery/fetchUserBatteries", async ({ userId, token }) => {
  const response = await tradeApiInstance.get(`/battery/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

export const createBattery = createAsyncThunk("battery/createBattery", async ({ batteryData, token }) => {
  const response = await tradeApiInstance.post("/battery", batteryData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

export const updateBattery = createAsyncThunk("battery/updateBattery", async ({ batteryId, updateData, token }) => {
  const response = await tradeApiInstance.patch(`/battery/${batteryId}`, updateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

export const deleteBattery = createAsyncThunk("battery/deleteBattery", async ({ batteryId, token }) => {
  await tradeApiInstance.delete(`/battery/${batteryId}`, {
    headers: { Authorization: `Bearer ${token}` },
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
  name: "battery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunk(builder, fetchBatteries, (state, action) => {
      state.batteries = action.payload;
    });

    handleAsyncThunk(builder, fetchBatteryById, (state, action) => {
      state.battery = action.payload;
    });

    handleAsyncThunk(builder, fetchUserBatteries, (state, action) => {
      state.userBatteries = action.payload;
    });

    handleAsyncThunk(builder, createBattery, (state, action) => {
      state.batteries.push(action.payload);
    });

    handleAsyncThunk(builder, updateBattery, (state, action) => {
      const index = state.batteries.findIndex((battery) => battery._id === action.payload._id);
      if (index !== -1) {
        state.batteries[index] = action.payload;
      }
    });

    handleAsyncThunk(builder, deleteBattery, (state, action) => {
      state.batteries = state.batteries.filter((battery) => battery._id !== action.payload);
    });
  },
});

export default batterySlice.reducer;
