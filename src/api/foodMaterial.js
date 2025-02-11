import axios from "../utils/http";
import qs from "qs"
export function getFoodMaterial(params) {
    return axios({
        method: 'get',
        url: `/foodMaterial/getFoodMaterial?${qs.stringify(params)}`,
    })
}
export function getFoodMaterialDesc(id) {
    return axios({
        method: 'get',
        url: `/foodMaterial/getFoodMaterialDesc/${id}`,
    })
}