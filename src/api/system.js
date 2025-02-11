import axios from "../utils/http";
import qs from "qs"

//食材管理
export function getSystemFoodMaterial(params) {
    return axios({
        method: 'get',
        url: `/system/getSystemFoodMaterial?${qs.stringify(params)}`
    })
}
export function addSystemFoodMaterial(data) {
    return axios({
        method: 'post',
        url: `/system/addSystemFoodMaterial`,
        data

    })
}
export function updateSystemFoodMaterial(data) {
    return axios({
        method: 'post',
        url: `/system/updateSystemFoodMaterial`,
        data

    })
}
export function deleteSystemFoodMaterial(id) {
    return axios({
        method: "get",
        url: `/system/deleteSystemFoodMaterial/${id}`,
    })
}

export function systemFoodMaterialIsRecommend(params) {
    return axios({
        method: 'get',
        url: `/system/systemFoodMaterialIsRecommend?${qs.stringify(params)}`
    })
}
export function addFoodMaterialImage(data) {
    return axios({
        method: 'post',
        url: `/system/addFoodMaterialImage`,
        data

    })
}

//食谱管理
export function getSystemRecipe(params) {
    return axios({
        method: 'get',
        url: `/system/getSystemRecipe?${qs.stringify(params)}`
    })
}
export function systemRecipeIsRecommend(params) {
    return axios({
        method: 'get',
        url: `/system/systemRecipeIsRecommend?${qs.stringify(params)}`
    })
}

//审核
export function getSystemRecipeAudit(params) {
    return axios({
        method: 'get',
        url: `/system/getSystemRecipeAudit?${qs.stringify(params)}`
    })
}
export function getSystemRecipeDesc(id) {
    return axios({
        method: 'get',
        url: `/system/getSystemRecipeDesc/${id}`
    })
}
export function systemRecipePass(params) {
    return axios({
        method: 'get',
        url: `/system/systemRecipePass?${qs.stringify(params)}`
    })
}

//通知公告
export function getSystemAnnouncement(params) {
    return axios({
        method: 'get',
        url: `/system/getSystemAnnouncement?${qs.stringify(params)}`
    })
}
export function addSystemAnnouncement(data) {
    return axios({
        method: 'post',
        url: `/system/addSystemAnnouncement`,
        data
    })
}
export function getSystemAnnouncementItemApi(id) {
    return axios({
        method: 'get',
        url: `/system/getSystemAnnouncementItem/${id}`
    })
}
export function updateSystemAnnouncement(data) {
    return axios({
        method: 'post',
        url: `/system/updateSystemAnnouncement`,
        data
    })
}
export function deleteSystemAnnouncement(id) {
    return axios({
        method: 'get',
        url: `/system/deleteSystemAnnouncement/${id}`
    })
}
export function getSystemAnnouncementAlter() {
    return axios({
        method: 'get',
        url: `/system/getSystemAnnouncementAlter`
    })
}
export function getSystemAnnouncementAlterRead(id) {
    return axios({
        method: 'get',
        url: `/system/getSystemAnnouncementAlterRead/${id}`
    })
}
export function addAnnouncementImage(data) {
    return axios({
        method: 'post',
        url: `/system/addAnnouncementImage`,
        data
    })
}

//user
export function getSystemUser(params) {
    return axios({
        method: 'get',
        url: `/system/getSystemUser?${qs.stringify(params)}`
    })
}
export function deleteSystemUser(id) {
    return axios({
        method: 'get',
        url: `/system/deleteSystemUser/${id}`
    })
}
export function editSystemUser(params) {
    return axios({
        method: 'get',
        url: `/system/editSystemUser?${qs.stringify(params)}`
    })
}

