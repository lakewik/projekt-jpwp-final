 
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000' // Replace with your API server URL
  });

  export default api;