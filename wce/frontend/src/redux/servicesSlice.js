import { createSlice } from '@reduxjs/toolkit';
import getServices from '../services/getServices';
import { useQuery } from 'react-query';

const fetchServices = async () => {
    const response = await getServices.getAll();
    return response;
  };

const servicesSlice = createSlice({
  name: 'services',
  initialState: [],
  reducers: {
    setServices: (state, action) => {
      return action.payload;
    },
  },
});
export const intializeServices = () => {
    return async dispach => {
        const Servic = await getServices.getAll()
        console.log("hello slice", Servic)
        dispach(setServices(Servic))
    }
}
export const { setServices } = servicesSlice.actions;
export default servicesSlice.reducer;

