import axios from "../utils/http";
import qs from "qs"

//论坛
export function getForumLable() {
    return axios({
        method: 'get',
        url: `/forum/getForumLable`
    })
}
export function addForum(data) {
    return axios({
        method: 'post',
        url: `/forum/addForum`,
        data
    })
}
export function getForumList(params) {
    return axios({
        method: 'get',
        url: `/forum/getForumList?${qs.stringify(params)}`,
    })
}
export function addForumView(params) {
    return axios({
        method: 'get',
        url: `/forum/addForumView`,
        params
    })
}
export function getForumInfo(params) {
    return axios({
        method: 'get',
        url: `/forum/getForumInfo`,
        params
    })
}

export function addForumComment(params) {
    return axios({
        method: 'get',
        url: `/forum/addForumComment`,
        params
    })
}
export function addChatUser(params) {
    return axios({
        method: 'get',
        url: `/forum/addChatUser`,
        params
    })
}
export function getChatUser() {
    return axios({
        method: 'get',
        url: `/forum/getChatUser`,
    })
}
export function getChat(params) {
    return axios({
        method: 'get',
        url: `/forum/getChat`,
        params
    })
}