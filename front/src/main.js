import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false
Vue.config.devtools = true

axios.defaults.baseURL = 'http://localhost:3000';

let token = localStorage.getItem('token');
if (token)
  axios.defaults.headers.common['Authorization'] = token;

// axios.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status == 401)
//       return router.replace('/about');
//     return Promise.reject(error);
//   }
// );

Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
