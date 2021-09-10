import Vue from 'vue'
import Router from 'vue-router'
import Config from '@/views/Config.vue'
import CreateWeapp from '@/views/create-project.vue'
import weappProject from '@/views/project.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: require('@/views/Home.vue').default
    },
    {
      path: '/config',
      name: 'Config',
      component: Config
    },
    {
      path: '/createWeapp',
      name: 'CreateWeapp',
      component: CreateWeapp
    },
    {
      path: '/weappProject',
      name: 'WeappProject',
      component: weappProject
    }
  ]
})

// 添加下面代码，解决这个报错：Avoided redundant navigation to current location: "/"
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
