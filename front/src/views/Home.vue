<template>
  <div v-if="user" class="home">
    <!-- <HelloWorld msg="Welcome to Camagru"/> -->
    <!-- <NewPost @upload="showUpload()"/> -->
    <Feed />
    <Upload v-if="showUpload" />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import Feed from '@/components/Feed.vue';
import Upload from '@/components/Upload.vue';
import { mapState } from 'vuex';

export default {
  name: 'home',
  data() {
    return {
      uploading: false,
    };
  },
  components: {
    Feed,
    Upload,
  },
  computed: {
    ...mapState(['showUpload', 'user'])
  },
}
</script>
