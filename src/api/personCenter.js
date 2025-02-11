import axios from "../utils/http";
import qs from "qs"

export function getUser() {
    return axios({
        method: 'get',
        url: `/user/getUser`
    })
}
export function getUserInfo() {
    return axios({
        method: 'get',
        url: `/user/getUserInfo`
    })
}
export function addUserConcern(params) {
    return axios({
        method: 'get',
        url: `/user/addUserConcern?${qs.stringify(params)}`
    })
}
export function getMyRecipe(params) {
    return axios({
        method: 'get',
        url: `/user/getMyRecipe?${qs.stringify(params)}`
    })
}
export function deleteRecipe(id) {
    return axios({
        method: 'get',
        url: `/user/deleteRecipe/${id}`
    })
}
export function getMyCollect(params) {
    return axios({
        method: 'get',
        url: `/user/getMyCollect?${qs.stringify(params)}`
    })
}
export function getMyConcern(params) {
    return axios({
        method: 'get',
        url: `/user/getMyConcern?${qs.stringify(params)}`
    })
}
export function getMyFans(params) {
    return axios({
        method: 'get',
        url: `/user/getMyFans?${qs.stringify(params)}`
    })
}
export function getEditUserInfo() {
    return axios({
        method: 'get',
        url: `/user/getEditUserInfo`
    })
}
export function editUserInfo(data) {
    return axios({
        method: 'post',
        url: `/user/editUserInfo`,
        data
    })
}