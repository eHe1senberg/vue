import axios from "../utils/http";
export function getRotograph() {
    return axios({
        method: 'get',
        url: '/home/getRotograph',
    })
}
export function getRecommendedIngredients() {
    return axios({
        method: 'get',
        url: '/home/getRecommendedIngredients',
    })
}

export function getRecommendedRecipe() {
    return axios({
        method: 'get',
        url: '/home/getRecommendedRecipe',
    })
}