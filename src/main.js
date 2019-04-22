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
