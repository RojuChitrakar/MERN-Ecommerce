
import API from "../api.js";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true
// });

// API.interceptors.request.use((config) => {
//   const user = JSON.parse(localStorage.getItem("userInfo"));

//   if (user?.token) {
//     config.headers.Authorization = `Bearer ${user.token}`;
//   }

//   return config;
// });

export const fetchProducts= async (params)=>{
  const {data}= await API.get ("/products", {params});
  return data;
};

export const fetchProductById=async (id)=>{
  const {data}=await API.get(`/products/${id}`);
  return data;
}

export const addReview=async (id, reviewData)=>{
  const {data}=await API.post(`/products/${id}/reviews`,reviewData);
  return data;
}