import axios from "axios";
import store from "../store";
import { setUser,  logout } from "../features/auth/authSlice";

// ✅ Create instance
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  withCredentials: true, // for sending cookies
});

// ✅ Request interceptor: attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        console.log("Refresh token response:", refreshRes.data.data);
        

        const {accessToken} = refreshRes.data.data;
        store.dispatch(setUser(refreshRes.data.data));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
