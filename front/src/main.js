import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

Vue.config.productionTip = false
Vue.config.devtools = true

let port = window.location.port;
if (port !== '')
  port = ':' + port;
axios.defaults.baseURL =
  `${window.location.protocol}//${window.location.hostname}${port}`;

axios.interceptors.response.use(null, (err) => {
  if (!err.response) {
    let e = { ...err };
    e.response = { data: { error: 'Network Error' } };
    return Promise.reject(e);
  }
  else
    return Promise.reject(err);
});

let token = localStorage.getItem('token');
if (token)
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

const bus = new Vue();
Vue.prototype.$http = axios;
Vue.prototype.$bus = bus;

Vue.component('v-icon', Icon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
