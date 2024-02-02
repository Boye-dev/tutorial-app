import axios from "axios";

export default axios.create({
  // baseURL: "http://localhost:4000",
  baseURL: "https://tutorial-app.onrender.com",
  withCredentials: true,
  credentials: "include",
});
