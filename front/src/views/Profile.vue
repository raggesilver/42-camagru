<template>
  <div class="d-flex profile flex-col">
    <Error v-if="error" :error="error" @dismiss="() => error = null" />
    <div class="header d-flex flex-ai-center flex-1" v-if="user">
      <img :src="user.picture" class="profile-pic large">
      <div class="d-flex flex-col ml-1 flex-ai-left flex-1 text-left">
        <h2 class="mb-0 mt-0">{{user.username}}</h2>
        <div class="d-flex flex-ai-center flex-1">
          <small class=""><b>{{posts.length}}</b> posts</small>
          <small class="ml-2"><b>{{
            (() => {
              let likes = 0;
              posts.forEach(p => likes += p.likes.length);
              return likes;
            })()
          }}</b> likes</small>
        </div>
      </div>
    </div>
    <Feed v-if="posts" :source="posts" class="mt-5" />
    <div v-if="loading" class="ml-auto mr-auto mt-2 text-center">
      <v-icon name="circle-notch" spin scale="2"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Feed from '@/components/Feed.vue';
import Error from '@/components/Error.vue';

export default {
  data() {
    return {
      isme: false,
      user: null,
      posts: null,
      error: null,
      loading: true,
    };
  },
  methods: {
    getProfile() {
      if (this.$store.state.user.username == this.$route.params.username)
        this.isme = true;

      axios.get(`/api/user/profile/${this.$route.params.username}`)
        .then(({data}) => {
          // console.log(data);
          this.user = data.user;
          this.posts = data.posts;
        })
        .catch((err) => {
          if (err.response)
            this.error = err.response.data.error;
        })
        .finally(() => this.loading = false);
    }
  },
  watch: {
    $route(to, from) {
      let me = this.$store.state.user.username;
      if ((to.params.username == 'me' && from.params.username == me) ||
          to.params.username == me && from.params.username == 'me')
        return ;
      this.user = null;
      this.posts = null;
      this.loading = true;
      this.isme = false;
      this.getProfile();
    },
  },
  mounted() {
    this.getProfile();
  },
  components: {
    Feed,
    Error,
  },
}
</script>

<style>
.profile {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.profile .header {
  border-bottom: 1px solid rgba(0, 0, 0, .05);
  padding-bottom: 1em;
}
</style>
