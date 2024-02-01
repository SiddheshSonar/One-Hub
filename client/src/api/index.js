import axios from 'axios';
import ServerUrl from '../constants.js'
import { toast } from 'react-toastify'

function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
}

const api = axios.create({
    baseURL: ServerUrl,
});

api.interceptors.request.use(async (req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            // localStorage.removeItem('token');
            toast.error('Session Expired! Please Login Again.', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
                });
            // toast.error('Session Expired! Please Login Again.');
            localStorage.clear();
            await timeout(2000);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

class Api {

    static async registerUser(data) {
        return await api.post('api/user/register', data);
    }

    static async loginUser(data) {
        return await api.post('api/user/login', data);
    }

    static async verifyOtp(data) {
        return await api.post('api/user/verify-otp', data);
    }
    
    static async sendTokentoBackend(data) {
        return await api.post('api/user/send-token', data);
    }

    static async uploadYoutube(data) {
        return await api.post('api/upload/youtube', data);
    }

    static async uploadInstagram(data) {
        return await api.post('api/upload/instagram', data);
    }

    static async uploadOnBoth(data) {
        return await api.post('api/upload/both', data);
    }

    static async getUserInfo(data) {
        return await api.post('api/user/get-user', data);
    }

    static async getInsights(data) {
        return await api.post('api/user/get-insights', data);
    }

    static async getUserSuggestions(data) {
        return await api.post('api/user/get/user-suggestions', data);
    }
}

export default Api;