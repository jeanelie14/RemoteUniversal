import { configureStore } from '@reduxjs/toolkit';
import tvReducer from './slices/tvSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    tv: tvReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
