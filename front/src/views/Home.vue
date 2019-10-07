<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Camagru"/>
    <Feed />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import Feed from '@/components/Feed.vue';

export default {
  name: 'home',
  components: {
    HelloWorld,
    Feed
  }
}
</script>
