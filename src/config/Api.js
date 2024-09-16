// api.js 
console.log(window.__API_URL__);
const API_URL = window.__API_URL__
  ? `${window.__API_URL__}`
  : 'http://127.0.0.1:8001/api';

export default API_URL;
