import axios from "axios";

const API = axios.create({
  baseURL: "https://focusflowstudytracker.onrender.com/api"
});

export default API;
