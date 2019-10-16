<template>
  <div class="new-post">
    <div class="content">
      <!-- <img :src="this.user.picture" class="profile-pic big"> -->
      <button v-if="logged"
        class="icon-button"
        @click="showUpload"
      >
        <v-icon name="camera" scale="1.5" class="fa-fw"/>
      </button>
      <hr v-if="logged" class="vertical">
      <router-link to="/" style="font-size: 14pt" class="logo">
        <img src="../assets/logo.png" style="height: 30px">
      </router-link>
      <div class="ml-auto mr-auto sep"></div>
      <button v-if="logged" class="icon-button"
        @click="() => $router.push('/profile/me').catch(() => {})"
      >
        <v-icon name="user" class="fa-fw"/>
      </button>
      <button v-if="logged" class="icon-button"
        @click="logout"
      >
        <v-icon name="sign-out-alt" class="fa-fw"/>
      </button>
      <button v-else class="icon-button d-flex flex-ai-center"
        @click="() => $router.push('/login').catch(() => {})"
      >
        <v-icon name="sign-in-alt" class="fa-fw"/>
        <span class="ml-1">Sign in</span>
      </button>
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
    showUpload() {
      this.$store.commit('setShowUpload', true);
      if (this.$route.path != '/')
        this.$router.push('/').catch(() => {});
    },
  }
}
</script>

<style scoped>
.new-post {
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  width: calc(100% + 16px);
  margin: -8px -8px 1em -8px;
  user-select: none;
}

.content {
  display: flex;
  align-items: center;
  min-height: 60px;
  padding: 5px 8px;
  max-width: 600px;
  margin: 0 auto;
}

button {
  color: black;
}

.logo {
  display: flex;
  margin-left: .25em;
}

.logo img {
  margin-top: 6px;
}

hr.vertical {
  margin: 0 .25em;
  height: 30px;
  border-color: rgba(0, 0, 0, 1);
  box-shadow: none;
  border-width: 0 0 0 1px;
}
</style>
