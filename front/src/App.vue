<template>
  <div id="app">
    <NewPost />
    <Error v-if="error" :error="error" @dismiss="() => error = null" />
    <!-- Make the content only be loaded once the user's data is fetched -->
    <router-view v-if="(this.logged && this.user) || !(this.logged)"/>
    <div v-else class="loader text-muted">
      <v-icon name="circle-notch" spin scale="1.5" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import NewPost from '@/components/NewPost.vue';
import Error from '@/components/Error.vue';

export default {
  data() {
    return {
      error: null,
    };
  },
  computed: {
    ...mapState(['logged', 'user', 'showUpload'])
  },
  components: {
    NewPost,
    Error,
  },
  methods: {
    doLogout() {
      this.$store
        .dispatch('logout')
        .then(() => this.$router.push('/about'));
    },
    fetchUser() {
      this.$store.dispatch('getUser')
        .then((user) => {
          if (!user.verified && this.$route.path != '/validate')
            return this.$router.replace('/validate');
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status == 401)
              this.doLogout();
            else
              this.error = err.response.data.error;
          }
          else
            err;
        });
    }
  },
  mounted() {
    if (this.logged) {
      /**
       * If the user is not verified invalidate it and let fecthUser handle the
       * rest.
       */
      if (this.user && !this.user.verified)
        this.$store.commit('setUser', null);
      this.fetchUser();
    }
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

a.secondary { text-decoration: none; }

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

button {
  padding: .75em 1.5em;
  border-radius: 6px;
  border: none;
  box-shadow:0 1px 2px rgba(0, 0, 0, .18);
}

button:not(.icon-button):hover {
  filter: brightness(.95);
}

button.icon,
button.icon-button {
  background: transparent;
  border: none;
  margin: 0;
  padding: 3px .5em;
  text-align: center;
  line-height: 50%;
  color: #2c3e50;
  box-shadow: none;
}

button.icon:not(:disabled),
button.icon-button:not(:disabled) {
  cursor: pointer;
}

button.icon:disabled,
button.icon-button:disabled {
  opacity: .4;
}

button.suggested {
  background: #42b983;
  color: white;
  font-weight: bold;
}

button.secondary {
  padding: .75em 1.5em;
  background: transparent;
  border: 2px solid rgb(66, 180, 185);
  color: #42b4b9;
  font-weight: bold;
}

button.suggested:not(:disabled):hover,
button.secondary:not(:disabled):hover {
  filter: brightness(.95);
}

button.suggested:not(:disabled):active,
button.secondary:not(:disabled):active {
  filter: brightness(.85);
}

button.suggested:disabled,
button.secondary:disabled {
  filter: grayscale(1);
}

.flex-right {
  margin-left: auto !important;
}

.text-muted {
  color: rgba(0, 0, 0, .7);
}

.text-center  { text-align: center; }
.text-left    { text-align: left; }
.text-right   { text-align: right; }
.text-justify { text-align: justify; }

.w-100  { width: 100%; }
.w-75   { width: 75%; }
.w-50   { width: 50%; }
.w-25   { width: 25%; }
.w-0    { width: 0; }

.d-flex   { display: flex; }
.d-block  { display: block; }
.d-inline { display: inline; }
.d-table  { display: table; }

.flex-col { flex-direction: column; }
.flex-rcol { flex-direction: column-reverse; }
.flex-row { flex-direction: row; }
.flex-rrow { flex-direction: row-reverse; }

.flex-1 { flex: 1; }
.flex-ai-center { align-items: center; }
.flex-ai-start { align-items: start; }
.flex-ai-end { align-items: end; }
.flex-jc-center { justify-content: center; }
.flex-jc-start { justify-content: start; }
.flex-jc-end { justify-content: end; }

.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

.vertical-slider {
  transition-property: all;
  transition-duration: .5s;
  overflow-y: hidden;
  max-height: 100px;
}

.vertical-slider:not(.show) {
  max-height: 0 !important;
  box-shadow: none !important;
  border-color: transparent !important;
}

.p-0 { padding: 0em !important; }
.p-1 { padding: 0.5em !important; }
.p-2 { padding: 1em !important; }
.p-3 { padding: 1.25em !important; }
.p-4 { padding: 1.5em !important; }
.p-5 { padding: 2em !important; }

.pl-0, .ph-0 { padding-left: 0em !important; }
.pl-1, .ph-1 { padding-left: 0.5em !important; }
.pl-2, .ph-2 { padding-left: 1em !important; }
.pl-3, .ph-3 { padding-left: 1.25em !important; }
.pl-4, .ph-4 { padding-left: 1.5em !important; }
.pl-5, .ph-5 { padding-left: 2em !important; }

.pr-0, .ph-0 { padding-right: 0em !important; }
.pr-1, .ph-1 { padding-right: 0.5em !important; }
.pr-2, .ph-2 { padding-right: 1em !important; }
.pr-3, .ph-3 { padding-right: 1.25em !important; }
.pr-4, .ph-4 { padding-right: 1.5em !important; }
.pr-5, .ph-5 { padding-right: 2em !important; }

.pb-0, .pv-0 { padding-bottom: 0em !important; }
.pb-1, .pv-1 { padding-bottom: 0.5em !important; }
.pb-2, .pv-2 { padding-bottom: 1em !important; }
.pb-3, .pv-3 { padding-bottom: 1.25em !important; }
.pb-4, .pv-4 { padding-bottom: 1.5em !important; }
.pb-5, .pv-5 { padding-bottom: 2em !important; }

.pt-0, .pv-0 { padding-top: 0em !important; }
.pt-1, .pv-1 { padding-top: 0.5em !important; }
.pt-2, .pv-2 { padding-top: 1em !important; }
.pt-3, .pv-3 { padding-top: 1.25em !important; }
.pt-4, .pv-4 { padding-top: 1.5em !important; }
.pt-5, .pv-5 { padding-top: 2em !important; }

.m-0 { margin: 0em !important; }
.m-1 { margin: 0.5em !important; }
.m-2 { margin: 1em !important; }
.m-3 { margin: 1.25em !important; }
.m-4 { margin: 1.5em !important; }
.m-5 { margin: 2em !important; }
.m-auto { margin: auto !important; }

.mh-auto {
  margin-left: auto !important;
  margin-right: auto !important;
}

.mv-auto {
  margin-top: auto !important;
  margin-bottom: auto !important;
}

.ml-0, .mh-0 { margin-left: 0em !important; }
.ml-1, .mh-1 { margin-left: 0.5em !important; }
.ml-2, .mh-2 { margin-left: 1em !important; }
.ml-3, .mh-3 { margin-left: 1.25em !important; }
.ml-4, .mh-4 { margin-left: 1.5em !important; }
.ml-5, .mh-5 { margin-left: 2em !important; }
.ml-auto { margin-left: auto !important; }

.mr-0, .mh-0 { margin-right: 0em !important; }
.mr-1, .mh-1 { margin-right: 0.5em !important; }
.mr-2, .mh-2 { margin-right: 1em !important; }
.mr-3, .mh-3 { margin-right: 1.25em !important; }
.mr-4, .mh-4 { margin-right: 1.5em !important; }
.mr-5, .mh-5 { margin-right: 2em !important; }
.mr-auto { margin-right: auto !important; }

.mb-0, .mv-0 { margin-bottom: 0em !important; }
.mb-1, .mv-1 { margin-bottom: 0.5em !important; }
.mb-2, .mv-2 { margin-bottom: 1em !important; }
.mb-3, .mv-3 { margin-bottom: 1.25em !important; }
.mb-4, .mv-4 { margin-bottom: 1.5em !important; }
.mb-5, .mv-5 { margin-bottom: 2em !important; }
.mb-auto { margin-bottom: auto !important; }

.mt-0, .mv-0 { margin-top: 0em !important; }
.mt-1, .mv-1 { margin-top: 0.5em !important; }
.mt-2, .mv-2 { margin-top: 1em !important; }
.mt-3, .mv-3 { margin-top: 1.25em !important; }
.mt-4, .mv-4 { margin-top: 1.5em !important; }
.mt-5, .mv-5 { margin-top: 2em !important; }
.mt-auto { margin-top: auto !important; }

.input {
  width: 100%;
  border: none;
  padding: 1em;
  border-radius: 5px;
  box-shadow:0 2px 4px rgba(0, 0, 0, .18);
}

.warning {
  background: rgb(219, 59, 33);
  color: white;
  font-weight: bold;
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
