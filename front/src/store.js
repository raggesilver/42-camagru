import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

function signFunction(context, url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(res => {
        const token = res.data.token;
        const user  = res.data.user;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        context.commit('setToken', token);
        context.commit('setUser', user);

        return resolve(res);
      })
      .catch(err => reject(err));
  });
}

export default new Vuex.Store({
  state: {
    logged: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    user: (() => {
      let d = localStorage.getItem('user');
      if (d) return JSON.parse(d);
      return null;
    })(),
    showUpload: false,
  },
  mutations: {
    setToken: (state, data) => {
      state.token = data;
      state.logged = !!data;

      if (data)
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data;
      else
        delete axios.defaults.headers.common['Authorization'];
    },
    setUser: (state, data) => {
      state.user = data;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.logged = false;
    },
    setShowUpload(state, data) {
      state.showUpload = !!data;
    }
  },
  actions: {
    login(context, data) {
      return signFunction(context, '/api/auth/login', data);
    },
    register(context, data) {
      return signFunction(context, '/api/auth/register', data);
    },
    logout(context) {
      return new Promise((resolve) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        context.commit('logout');
        delete axios.defaults.headers.common['Authorization'];
        resolve();
      });
    },
    getUser(context) {
      return new Promise((resolve, reject) => {
        axios.get('/api/user/me')
          .then(({ data }) => {
            localStorage.setItem('user', JSON.stringify(data));
            context.commit('setUser', data);
            return resolve(data);
          })
          .catch((err) => {
            // TODO: maybe this should also context.commit('setUser', null)
            localStorage.removeItem('user');
            return reject(err);
          });
      });
    }
  }
});
