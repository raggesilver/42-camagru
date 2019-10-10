<template>
  <div class="home">
    <!-- <HelloWorld msg="Welcome to Camagru"/> -->
    <NewPost @upload="showUpload()"/>
    <Feed />
    <Upload v-if="uploading" @close="hideUpload()"/>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import Feed from '@/components/Feed.vue';
import NewPost from '@/components/NewPost.vue';
import Upload from '@/components/Upload.vue';

export default {
  name: 'home',
  data() {
    return {
      uploading: false,
    };
  },
  components: {
    Feed,
    NewPost,
    Upload,
  },
  methods: {
    showUpload() {
      this.uploading = true;
    },
    hideUpload() {
      this.uploading = false;
    },
  },
}
</script>
