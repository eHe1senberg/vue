import axios from 'axios'
import { showFullScreenLoading, tryHideFullScreenLoading } from "./loadding"
import { getCookie } from "./auth"
axios.defaults.baseURL = "/healthy"
axios.defaults.withCredentials = true
axios.defaults.timeout = 5000
axios.interceptors.request.use(config => {
    if (getCookie()) {
        config.headers['Authorization'] = getCookie()
    }
    showFullScreenLoading()
    return config
}, err => {
    return Promise.reject(err)
})
axios.interceptors.response.use(response => {
    tryHideFullScreenLoading()
    return response.data;
}, err => {
    tryHideFullScreenLoading()
    return Promise.reject(err)
})
export default axios