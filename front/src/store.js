import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    logged: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    user: null,
  },
  mutations: {
    setToken: (state, data) => {
      state.token = data;
      state.logged = !!data;
    },
    setUser: (state, data) => {
      state.user = data;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.logged = false;
    }
  },
  actions: {
    login(context, data) {
      return new Promise((resolve, reject) => {
        axios.post('/api/auth/login', data)
          .then(res => {
            const token = res.data.token;
            const user  = res.data.user;

            axios.defaults.headers.common['Authorization'] = token;

            localStorage.setItem('token', token);

            context.commit('setToken', token);
            context.commit('setUser', user);

            return resolve(res);
          })
          .catch(err => reject(err));
      });
    },
    logout(context) {
      return new Promise((resolve) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        context.commit('logout');
        delete axios.defaults.headers.common['Authorization'];
        resolve();
      });
    }
  }
});
