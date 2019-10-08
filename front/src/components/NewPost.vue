<template>
  <div v-if="this.user" class="new-post">
    <!-- <img :src="this.user.picture" class="profile-pic big"> -->
    <button class="icon-button">
      <v-icon name="camera" scale="1.5"/>
    </button>
    <hr class="vertical">
    <router-link to="/" style="font-size: 14pt" class="logo">
      <img src="../assets/logo.png" style="height: 30px">
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState(['user']),
}
</script>

<style scoped>
.new-post {
  text-align: left;
  display: flex;
  align-items: center;
  padding: 5px 8px;
  /* box-shadow: 0 4px 4px -4px rgba(0, 0, 0, 0.18); */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  width: calc(100% + 16px);
  margin: -8px -8px 1em -8px;
  min-height: 60px;
  user-select: none;
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
