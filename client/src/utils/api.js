import axios from 'axios'
import { API_URL } from "@env";

const client = API_URL || 'http://localhost:4000';

const get = async (url, params, token, axiosConfig) => {
    const headers = axiosConfig ? { ...axiosConfig.headers } : {}
    if (token) headers['Authentication'] = `Bearer ${token}`
    return axios.get(`${client}${url}`, {
        ...axiosConfig,
        headers,
        params,
    })
}

const post = async (url, data, token, axiosConfig) => {
    const headers = axiosConfig ? { ...axiosConfig.headers } : {}
    if (token) headers['Authentication'] = `Bearer ${token}`
    return axios.post(`${client}${url}`, data, {
        ...axiosConfig,
        headers,
    })
}

const remove = async (url, token, axiosConfig) => {
    const headers = axiosConfig ? { ...axiosConfig.headers } : {}
    if (token) headers['Authentication'] = `Bearer ${token}`
    return axios.delete(`${client}${url}`, {
        ...axiosConfig,
        headers,
    })
}

const put = async (url, data, token, axiosConfig) => {
    const headers = axiosConfig ? { ...axiosConfig.headers } : {}
    if (token) headers['Authentication'] = `Bearer ${token}`
    return axios.put(`${client}${url}`, data, {
        ...axiosConfig,
        headers,
    })
}

const api = { get, post, remove, put }
export default api

