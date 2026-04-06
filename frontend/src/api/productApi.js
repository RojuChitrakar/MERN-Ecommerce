import axios from "axios";

const API=axios.create({
  baseURL:"http://localhost:5000",
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});
export const fetchProducts= async (params)=>{
  const {data}= await API.get ("/api/products", {params});
  return data;
};

export const fetchProductById=async (id)=>{
  const {data}=await API.get(`/api/products/${id}`);
  return data;
}

export const addReview=async (id, reviewData)=>{
  const {data}=await API.post(`/api/products/${id}/reviews`,reviewData);
  return data;
}