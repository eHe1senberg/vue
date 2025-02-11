import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
import "@/assets/styles.css"
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import install from './utils/pbugin'  //引入插件

Vue.use(VueQuillEditor);
Vue.use(ElementUI)
Vue.use(install)
Vue.config.productionTip = false


new Vue({
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this; // 安装全局事件总线
  },
  render: h => h(App)
}).$mount('#app')
