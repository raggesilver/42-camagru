<template>
  <div id="app">
    <div v-if="this.logged" id="nav">
      <router-link to="/">Home</router-link>
      <a href="#" @click="logout">Logout</a>
    </div>
    <div v-else id="nav">
      <router-link to="/about">About</router-link>
      <router-link to="/login">Login</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['logged'])
  },
  methods: {
    logout(e) {
      e.preventDefault();
      if (window.confirm('Do you really want to logout?'))
        this.$store
          .dispatch('logout')
          .then(() => this.$router.push('/about'));
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  margin: 0 .25em;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
