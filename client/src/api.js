// api.js
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://api.thptlethuy.online/?fbclid=IwAR1c1bhSa_qRg71PsqdldTprmdtr-M40K8BmekRkm8WSkxkzuqUaycdUAOw';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
  // Set the JWT token in the Authorization header
//   export const setAuthToken = (token) => {
//     if (token) {
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//       delete api.defaults.headers.common['Authorization'];
//     }
//   };
export default api;
