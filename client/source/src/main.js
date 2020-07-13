import Vue from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import VueRouter from 'vue-router'

import Home from './components/Home'
import Login from './components/Login'

Vue.config.productionTip = false
Vue.prototype.$serverUrl = 'http://localhost:3000';
Vue.use(VueCookies)
Vue.use(VueRouter)
  
const router = new VueRouter({
    routes: [
        { path: '/home', component: Home },
        { path: '/', component: Login },
    ],
    mode: 'history'
})

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
