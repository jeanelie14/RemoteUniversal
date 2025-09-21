import { tvSlice, startScanning, setDevices, setError, selectDevice } from '../slices/tvSlice';
import { TVDevice } from '../../types';

describe('tvSlice', () => {
  const initialState = {
    devices: [],
    currentDevice: null,
    isScanning: false,
    isConnected: false,
    error: null,
  };

  const mockTV: TVDevice = {
    id: 'test-tv',
    name: 'Test TV',
    brand: 'Samsung',
    model: 'Test Model',
    ipAddress: '192.168.1.100',
    connectionType: 'wifi',
    isConnected: false,
    lastUsed: new Date().toISOString(),
  };

  it('should handle initial state', () => {
    expect(tvSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle startScanning', () => {
    const actual = tvSlice.reducer(initialState, startScanning());
    expect(actual.isScanning).toBe(true);
    expect(actual.error).toBeNull();
  });

  it('should handle setDevices', () => {
    const devices = [mockTV];
    const actual = tvSlice.reducer(initialState, setDevices(devices));
    expect(actual.devices).toEqual(devices);
    expect(actual.isScanning).toBe(false);
  });

  it('should handle setError', () => {
    const errorMessage = 'Test error';
    const actual = tvSlice.reducer(initialState, setError(errorMessage));
    expect(actual.error).toBe(errorMessage);
    expect(actual.isScanning).toBe(false);
  });

  it('should handle selectDevice', () => {
    const actual = tvSlice.reducer(initialState, selectDevice(mockTV));
    expect(actual.currentDevice).toEqual(mockTV);
  });

  it('should clear error when starting scan', () => {
    const stateWithError = { ...initialState, error: 'Previous error' };
    const actual = tvSlice.reducer(stateWithError, startScanning());
    expect(actual.error).toBeNull();
  });

  it('should clear scanning state when setting devices', () => {
    const scanningState = { ...initialState, isScanning: true };
    const devices = [mockTV];
    const actual = tvSlice.reducer(scanningState, setDevices(devices));
    expect(actual.isScanning).toBe(false);
  });

  it('should clear scanning state when setting error', () => {
    const scanningState = { ...initialState, isScanning: true };
    const actual = tvSlice.reducer(scanningState, setError('Test error'));
    expect(actual.isScanning).toBe(false);
  });
});
