<template>
  <div class="home">
    <!-- <HelloWorld msg="Welcome to Camagru"/> -->
    <NewPost />
    <Feed />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import Feed from '@/components/Feed.vue';
import NewPost from '@/components/NewPost.vue';

export default {
  name: 'home',
  components: {
    // HelloWorld,
    Feed,
    NewPost,
  },
}
</script>
