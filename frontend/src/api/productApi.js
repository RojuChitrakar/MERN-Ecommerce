import axios from "axios";

const API=axios.create({
  baseURL:"http://localhost:5000",
});

export const fetchProducts= async (params)=>{
  const {data}= await API.get ("/api/products", {params});
  return data;
};

export const fetchProductById=async (id)=>{
  const {data}=await API.get(`/api/products/${id}`);
  return data;
}