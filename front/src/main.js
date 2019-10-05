import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false
Vue.config.devtools = true

let ax = axios.create({
  baseURL: 'http://localhost:3000'
});

// ax.interceptors.response.use(
//   undefined,
//   function (error) {
//     if (typeof error.response !== 'undefined') {
//       if (error.response.status === 401)
//         return router.go('/login');
//       return Promise.resolve(error);
//     }
//     return Promise.reject(error);
//   }
// );

Vue.prototype.$http = ax;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
