// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import scroll from 'vue-seamless-scroll' // 无缝滚动
import ElementUI from 'element-ui'
import Mint from 'mint-ui'
// import VTouch from 'vue-touch';
import Vue2TouchEvents from 'vue2-touch-events'
import 'element-ui/lib/theme-chalk/index.css'
import 'mint-ui/lib/style.css'

// 调试
// import VConsole from 'vconsole';
// var vConsole = new VConsole();
// 调试end
Vue.use(scroll) // 全局使用
Vue.use(Mint)
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.use(Vue2TouchEvents)
// Vue.use(VTouch, { name: 'v-touch' })
Vue.config.productionTip = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
