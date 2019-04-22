import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    }
  ]
})

// 给router设置路由守卫，非登录用户禁止访问后台页面
router.beforeEach((to, from, next) => {
  // 获取token，并判断是否存在
  var token = window.sessionStorage.getItem('token')
  if (token === null && to.path !== '/login') {
    // 强制跳转登录页
    return next('/login')
  }
  // 路由继续执行
  next()
})

export default router
