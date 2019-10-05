import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    user: (() => {
      let user = localStorage.getItem('user');
      if (user)
        return JSON.parse(user);
      return null;
    })(),
  },
  mutations: {
    setToken: (state, data) => {
      state.token = data;
      state.logged = !!data;
      localStorage.setItem('token', data);
    },
    setUser: (state, data) => {
      state.user = data;
      localStorage.setItem('user', data ? JSON.stringify(data) : null);
    }
  },
  actions: {
  }
})
