// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入当前项目的全局css样式控制文件
import './assets/css/global.css'

// 引入字体图标样式文件
import './assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'

// 引入element-ui
import ElementUI from 'element-ui'
Vue.use(ElementUI)

// 给axios做配置
// axios配置请求公共根地址
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
// 设置拦截器，给axios装配token信息
axios.interceptors.request.use(
  function(config) {
    // config:对象，是axios的子级成员
    // 可以对其进行配置，这个配置信息会直接作用给axios
    // 获取token
    var token = window.sessionStorage.getItem('token')
    // 给token的请求头中设置token信息，名称为Authorization
    config.headers.Authorization = token
    return config
  },
  function(err) {
    return Promise.reject(err)
  }
)
// 给axios配置成为vue的成员
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
