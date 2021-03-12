import axios from 'axios';
import { API_PORT, API_URL } from '../src/utils/constants';
// const API_KEY = '123456';
// const API_URL = 'http://78410e468830.ngrok.io';
// const API_PORT = 80;

const API_URL_PORT = `${API_URL}:${API_PORT}`;
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 50000,
  validateStatus: status => status < 400,
});


const axiosCall = async (axiosInst, url, { query, ...requestOptions }) =>
  axiosInst({
    method: requestOptions.method,
    url: encodeQueryParams(`${API_URL_PORT}${url}`, query).toString(),
    data: requestOptions.body,
    headers: requestOptions.headers,
  });

const apiCall = async (...args) => {
  try {
    const response = await axiosCall(axiosInstance, ...args);
    if (response.status >= 200 && response.status < 400) {
      return response;
    }
    return null;
  } catch (error) {
    console.log(error)
    throw error
  }
};

const encodeQueryParams = (url, query) => {
  const encodeURL = new URL(url);
  // ToDo: Have to agree how to encode null
  if (query) {
    Object.entries(query).forEach(([k, v]) =>
      encodeURL.searchParams.append(k, v),
    );
  }
  return encodeURL;
};

export const unAuthAxiosCall = (url, requestOptions) => {
  return apiCall(url, requestOptions);
};

export const authAxiosCall = async (url, requestOptions) => {
  const token = await getToken();
  return manualAuthAxiosCall(token, url, requestOptions);
};

export const manualAuthAxiosCall = async (token, url, requestOptions) => {
  return apiCall(url, {
    ...requestOptions,
    headers: {
      ...requestOptions.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};