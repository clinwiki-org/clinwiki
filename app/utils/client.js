import axios from 'axios';

export default axios.create({
  baseURL: process.env.API_HOST,
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
