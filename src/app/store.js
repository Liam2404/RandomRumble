import { configureStore } from '@reduxjs/toolkit';
import fightReducer from '../features/fight/fightSlice.js';

export const store = configureStore({
  reducer: {
    fight: fightReducer,
  },
});

export default store
