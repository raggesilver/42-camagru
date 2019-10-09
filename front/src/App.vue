<template>
  <div id="app">
    <!-- <div v-if="this.logged" id="nav">
      <router-link to="/">Home</router-link>
      <a href="#" @click="logout">Logout</a>
    </div>
    <div v-else id="nav">
      <router-link to="/about">About</router-link>
      <router-link to="/login">Login</router-link>
    </div> -->

    <!-- Make the content only be loaded once the user's data is fetched -->
    <router-view v-if="(this.logged && this.user) || !(this.logged)"/>
    <div v-else class="loader text-muted">
      <v-icon name="circle-notch" spin scale="1.5" />
      <!-- <span>Loading user data</span> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['logged', 'user'])
  },
  methods: {
    doLogout() {
      this.$store
        .dispatch('logout')
        .then(() => this.$router.push('/about'));
    },
    logout(e) {
      e.preventDefault();
      if (window.confirm('Do you really want to logout?'))
        this.doLogout();
    },
    fetchUser() {
      this.$store.dispatch('getUser')
        // FIXME: remove console.log
        .then(() => console.log('User updated, cache overwritten.'))
        .catch((err) => {
          if (err.response && err.response.status == 401)
            this.doLogout();
          else
            console.log(err);
        });
    }
  },
  mounted() {
    if (this.logged)
      this.fetchUser();
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

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

/* Global CSS */

a,
a:visited {
  color: #42b983;
}

.profile-pic {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}

.profile-pic.big { width: 60px; height: 60px }
.profile-pic.large { width: 100px; height: 100px }

.profile-pic.small { width: 30px; height: 30px }
.profile-pic.tiny { width: 20px; height: 20px }

button.icon,
button.icon-button {
  background: transparent;
  border: none;
  margin: 0;
  padding: 3px .5em;
  text-align: center;
  line-height: 50%;
  color: #2c3e50;
}

button.icon:not(:disabled),
button.icon-button:not(:disabled) {
  cursor: pointer;
}

button.icon:disabled,
button.icon-button:disabled {
  opacity: .4;
}

.flex-right {
  margin-left: auto !important;
}

.text-muted {
  color: rgba(0, 0, 0, .7);
}

.d-flex   { display: flex; }
.d-block  { display: block; }
.d-inline { display: inline; }
.d-table  { display: table; }

.flex-col { flex-direction: column; }
.flex-rcol { flex-direction: column-reverse; }
.flex-row { flex-direction: row; }
.flex-rrow { flex-direction: row-reverse; }

.flex-1 { flex: 1; }

.vertical-slider {
  transition-property: all;
  transition-duration: .5s;
  overflow-y: hidden;
  max-height: 100px;
}

.vertical-slider:not(.show) {
  max-height: 0;
}

</style>

<style scoped>
.loader {
  position: fixed;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  background: white;
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
