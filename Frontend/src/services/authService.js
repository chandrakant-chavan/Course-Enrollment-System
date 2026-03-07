import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (name, email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const googleLogin = async (token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/google`, { token });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};
