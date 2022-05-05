import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL:  'http://localhost:5000/api/v1',
});

const handleRequest = (request) => {

    const token = localStorage.getItem('token');

    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`;
    }
    request.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
    return request;
};

axiosInstance.interceptors.response.use(
    res => res,
    error => {
        return Promise.reject(error.response);
    },
);

axiosInstance.interceptors.request.use(req => handleRequest(req));

