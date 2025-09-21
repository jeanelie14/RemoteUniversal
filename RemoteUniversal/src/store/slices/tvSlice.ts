import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TVDevice } from '../../types';

interface TVState {
  devices: TVDevice[];
  currentDevice: TVDevice | null;
  isScanning: boolean;
  isConnected: boolean;
  error: string | null;
}

const initialState: TVState = {
  devices: [],
  currentDevice: null,
  isScanning: false,
  isConnected: false,
  error: null,
};

const tvSlice = createSlice({
  name: 'tv',
  initialState,
  reducers: {
    startScanning: (state) => {
      state.isScanning = true;
      state.error = null;
    },
    stopScanning: (state) => {
      state.isScanning = false;
    },
    setDevices: (state, action: PayloadAction<TVDevice[]>) => {
      state.devices = action.payload;
      state.isScanning = false;
    },
    selectDevice: (state, action: PayloadAction<TVDevice>) => {
      state.currentDevice = action.payload;
      state.isConnected = true;
    },
    disconnectDevice: (state) => {
      state.currentDevice = null;
      state.isConnected = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isScanning = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateDeviceStatus: (state, action: PayloadAction<{ id: string; isConnected: boolean }>) => {
      const device = state.devices.find(d => d.id === action.payload.id);
      if (device) {
        device.isConnected = action.payload.isConnected;
      }
      if (state.currentDevice?.id === action.payload.id) {
        state.currentDevice.isConnected = action.payload.isConnected;
      }
    },
  },
});

export const {
  startScanning,
  stopScanning,
  setDevices,
  selectDevice,
  disconnectDevice,
  setError,
  clearError,
  updateDeviceStatus,
} = tvSlice.actions;

export { tvSlice };
export default tvSlice.reducer;
