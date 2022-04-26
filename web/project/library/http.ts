import axios, { AxiosRequestConfig } from 'axios';
const instance = axios.create({
  baseURL:
    typeof window === 'undefined'
      ? 'http://localhost:3000'
      : 'http://localhost:53000',
});
instance.defaults.headers.common['Content-Type'] = 'Application/json';

const post = async (url: string, data?: any) => {
  try {
    return await instance.post(url, data);
  } catch (err: any) {
    throw err.response ?? err;
  }
};

const get = async (url: string, config?: AxiosRequestConfig) => {
  try {
    return await instance.get(url, config);
  } catch (err: any) {
    throw err.response ?? err;
  }
};

export const http = {
  post,
  get,
};
