import axios from "axios";

const apiUrl = import.meta.env.VITE_API_CID_URL || "/";

const apiCid = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

export default apiCid;
