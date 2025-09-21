import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TVProfile } from '../../types';

interface ProfileState {
  profiles: TVProfile[];
  currentProfile: TVProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profiles: [],
  currentProfile: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setProfiles: (state, action: PayloadAction<TVProfile[]>) => {
      state.profiles = action.payload;
      state.isLoading = false;
    },
    addProfile: (state, action: PayloadAction<TVProfile>) => {
      state.profiles.push(action.payload);
    },
    updateProfile: (state, action: PayloadAction<TVProfile>) => {
      const index = state.profiles.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.profiles[index] = action.payload;
      }
    },
    deleteProfile: (state, action: PayloadAction<string>) => {
      state.profiles = state.profiles.filter(p => p.id !== action.payload);
    },
    selectProfile: (state, action: PayloadAction<TVProfile>) => {
      state.currentProfile = action.payload;
    },
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    },
    setProfileError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearProfileError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setProfiles,
  addProfile,
  updateProfile,
  deleteProfile,
  selectProfile,
  clearCurrentProfile,
  setProfileError,
  clearProfileError,
} = profileSlice.actions;

export default profileSlice.reducer;
