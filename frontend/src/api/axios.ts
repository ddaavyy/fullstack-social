import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use((cfg) => {
  if (Cookies.get("access_token"))
    cfg.headers.Authorization = `Bearer ${Cookies.get("access_token")}`;
  return cfg;
});

export default api;
