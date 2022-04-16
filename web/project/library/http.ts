import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = 'Application/json';

const post = async (url: string, data?: any) => {
  try {
    return await axios.post(url, data);
  } catch (err: any) {
    throw err.response;
  }
};

export const http = {
  post,
};
