import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:6021',
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('TOKEN');
  console.log("TOKEN QUE ESTÁ SENDO NO HEADER ===>", token);

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});


export default api;
