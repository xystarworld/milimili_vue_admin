import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/homePage.vue'
import Login from '../views/login/loginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login 
    },
    {
      path:'/home',
      name:'home',
      component: Home
    },
    {
      path:'/user',
      name:'user',
      component: ()=> import('../views/management/user.vue')
    },
    {
      path:'/document',
      name:'document',
      component: ()=> import('../views/management/document.vue')
    },
    {
      path:'/my',
      name:'my',
      component: ()=> import('../views/my/my.vue')
    },
    {
      path:'/admin',
      name:'admin',
      component: ()=> import('../views/management/admin.vue')
    },
    {
      path:'/video',
      name:'video',
      component: ()=> import('../views/management/video.vue')
    },
    {
      path:'/postcheck',
      name:'post',
      component: () => import('../views/check/post_check.vue')
    }
  ],
})

export default router
