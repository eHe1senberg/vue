import { pvRecipe } from "../api/recipe"
import { addForumView, addChatUser } from "../api/forum"
export default {
    install(Vue) {
        // 自定义指令
        Vue.directive('pvRecipe', {
            inserted(el, binding, vnode) {
                el.onclick = () => {
                    let params = {
                        age: binding.value
                    }
                    //pv接口
                    pvRecipe(params)
                }
            }
        })
        Vue.directive('pvForum', {
            inserted(el, binding, vnode) {
                el.onclick = () => {
                    let params = {
                        id: binding.value
                    }
                    //pv接口
                    addForumView(params)
                }
            }
        })
    }
}