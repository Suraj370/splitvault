import axios from 'axios';
import { setLoading, setUser, setError } from './authSlice';

const API_URL =   import.meta.env.VITE_BASE_URL +  '/api/auth';

export const registerUser = (formData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.post(`${API_URL}/register`, formData);
    dispatch(setUser(response.data.data));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || 'Register failed'));
  }
};

export const loginUser = (formData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.post(`${API_URL}/login`, formData, {withCredentials: true});
    dispatch(setUser(response.data.data));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || 'Login failed'));
  }
};