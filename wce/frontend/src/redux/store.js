import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './servicesSlice';

const store = configureStore({
  reducer: {
    services: servicesReducer,
  },
});

export default store;
