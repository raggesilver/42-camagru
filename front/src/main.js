import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

Vue.config.productionTip = false
Vue.config.devtools = true

axios.defaults.baseURL = 'http://localhost:3000';

let token = localStorage.getItem('token');
if (token)
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

Vue.prototype.$http = axios;

Vue.component('v-icon', Icon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
