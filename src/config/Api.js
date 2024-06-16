console.log(import.meta.env.VITE_API_URL);
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://127.0.0.1:8001/api';

export default API_URL;
