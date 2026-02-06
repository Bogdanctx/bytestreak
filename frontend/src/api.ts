import axios from "axios";

const BACKEND_API_URL = "http://localhost:8080";

export const api = axios.create({
    baseURL: BACKEND_API_URL,
    withCredentials: true
});