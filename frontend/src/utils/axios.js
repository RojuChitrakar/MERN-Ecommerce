import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // must include /api
  withCredentials: true
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default API;