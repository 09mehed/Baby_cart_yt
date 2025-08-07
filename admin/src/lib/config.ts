import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// configuration admin api

interface AdminConfig {
    baseURL: string;
    isProduction: boolean;
}

export const getAdminApiConfig = (): AdminConfig => {
    const apiUrl = import.meta.env.VITE_API_URL;

    if(!apiUrl){
        console.error("Vite api url environment variable is not defined");
    }

    const isProduction = import.meta.env.VITE_API_URL === "production" || import.meta.env.PROD === true;

    return {
        baseURL: `${apiUrl}/api`,
        isProduction,
    }
}

const createApiInstance = (): AxiosInstance => {
    const {baseURL} = getAdminApiConfig() 
    const instance = axios.create({
        baseURL,
        headers:{
            "Content-Type": "application/json",
        },
        withCredentials: true,
        timeout: 30000,
    })

    instance.interceptors.request.use((config) => {
        const authData = localStorage.getItem("auth-storage");
        if(authData){
            try { 
                const parseData = JSON.parse(authData)
                const token = parseData.token;
                if(token){
                    config.headers.Authorization = `Bearer ${token}`
                }
            } catch (error) {
                console.error("Error parsing auth data", error);
            }
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    }) 

    instance.interceptors.response.use((response:AxiosResponse) => response, (error) => {
        if(error.code === "ERR_NETWORK"){
            console.error("Network error to the server");
        }
        if(error.response?.status === 401){
            localStorage.removeItem("auth-storage");
            window.location.href = '/login'
        }
        return Promise.reject(error)
    })
    return instance;
}

export const adminApi = createApiInstance();

export const ADMIN_API_ENDPOINT = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
} as const;

export const buildAdminQueryParams = (params: Record<string, string | number | boolean | undefined>): string => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if(value !== undefined && value !== null && value !== ""){
            searchParams.append(key, String(value))
        }
    })
    const queryString = searchParams.toString();
    return queryString ? `${queryString}` : "";
}

export default adminApi;