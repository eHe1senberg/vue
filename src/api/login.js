import axios from "../utils/http";
import qs from "qs"
export function getCaptcha() {
    return axios({
        method: 'get',
        url: `/public/captcha`,
    })
}
export function getPhoneCode(params) {
    return axios({
        method: 'post',
        url: `/public/getPhoneCode`,
        data: params
    })
}
export function getPhoneCodeReguser(params) {
    return axios({
        method: 'post',
        url: `/public/getPhoneCodeReguser`,
        data: params
    })
}
export function login(params) {
    return axios({
        method: 'post',
        url: `/public/login`,
        data: params
    })
}
export function regUser(params) {
    return axios({
        method: 'post',
        url: `/public/regUser`,
        data: params
    })
}