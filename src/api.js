import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // Базовый URL
  withCredentials: true, // Для куков (если используете)
});

// Добавляем перехватчик для каждого запроса
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Или из cookie/vuex/redux
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
