import axios from "../utils/http";
import qs from "qs"
export function getRecipe(params) {
    return axios({
        method: 'get',
        url: `/recipe/getRecipe?${qs.stringify(params)}`,
    })
}
export function addRecipe(params) {
    return axios({
        method: 'post',
        url: `/recipe/addRecipe`,
        data: params
    })
}
export function editRecipe(params) {
    return axios({
        method: 'post',
        url: `/recipe/editRecipe`,
        data: params
    })
}
export function addStepImage(params) {
    return axios({
        method: "post",
        url: `/recipe/addStepImage`,
        data: params
    })
}
export function getRecipeDesc(id) {
    return axios({
        method: 'get',
        url: `/recipe/getRecipeDesc/${id}`
    })
}
export function addComment(params) {
    return axios({
        method: "get",
        url: `/recipe/addComment?${qs.stringify(params)}`
    })
}
export function addCommentLike(params) {
    return axios({
        method: "get",
        url: `/recipe/addCommentLike?${qs.stringify(params)}`
    })
}

export function getRecipeNum(id) {
    return axios({
        method: "get",
        url: `/recipe/getRecipeNum/${id}`
    })
}
export function addLike(params) {
    return axios({
        method: "get",
        url: `/recipe/addLike?${qs.stringify(params)}`
    })
}
export function addCollect(params) {
    return axios({
        method: "get",
        url: `/recipe/addCollect?${qs.stringify(params)}`
    })
}
export function getUserInfo(id) {
    return axios({
        method: "get",
        url: `/recipe/getUserInfo/${id}`
    })
}
export function pvRecipe(params) {
    return axios({
        method: "get",
        url: `/recipe/pvRecipe`,
        params
    })
}