<template>
  <div class="d-flex profile flex-col">

    <Error v-if="error" :error="error" @dismiss="() => error = null" />

    <div class="header d-flex flex-ai-center flex-1" v-if="user">
      <img :src="user.picture" class="profile-pic large">
      <div class="d-flex flex-col ml-1 flex-ai-left flex-1 text-left">
        <h2 class="mb-0 mt-0">{{ user.username }}</h2>
        <div class="d-flex flex-ai-center flex-1">
          <small class=""><b>{{ posts.length }}</b> posts</small>
          <small class="ml-2"><b>{{ likes }}</b> likes</small>
        </div>
      </div>
    </div>

    <form class="d-flex flex-ai-start flex-1 pt-2 editor flex-col"
      @submit="editProfile">

      <Error v-if="editError" :error="editError"
        @dismiss="() => editError = null" />

      <h3>Edit profile</h3>

      <div class="input-group d-flex flex-ai-center w-100 mb-1">
        <label for="username">Username</label>
        <input type="text" id="username" class="input flex-1"
          v-model="username">
      </div>
      <div class="input-group d-flex flex-ai-center w-100 mb-1">
        <label for="oldPassword">Old password</label>
        <input type="password" id="oldPassword" class="input flex-1">
      </div>
      <div class="input-group d-flex flex-ai-center w-100 mb-1">
        <label for="newPassword">New password</label>
        <input type="password" id="newPassword" class="input flex-1">
      </div>

      <div class="d-flex flex-jc-end flex-1 w-100 mt-3">
        <button class="button warning mr-2" type="reset">
          Discard changes
        </button>
        <button class="button suggested" type="submit">
          Save changes
        </button>
      </div>
    </form>

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
      editing: true,
      // Editing fields
      username: null,
      oldPassword: null,
      newPassword: null,
      editError: null,
    };
  },
  computed: {
    likes() {
      let l = 0;
      this.posts.forEach(p => l += p.likes.length);
      return l;
    },
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
    },
    editProfile(e) {
      e.preventDefault();
      console.log('Edit');
    },
  },
  watch: {
    // When route changes, reload user info. Unless changing from self <--> me
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
    // Model variables
    this.username = this.$store.state.user.username;
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

.profile .header,
.editor {
  padding-bottom: 1em;
}

.editor,
.profile .header:not(.editing) {
  border-bottom: 1px solid rgba(0, 0, 0, .05);
}

.editor {
  width: 100%;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
}

.input-group {
  transition: all .15s ease-in-out;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, .2);
  background: white;
}

.input-group:focus-within {
  box-shadow: 0 2px 4px rgba(0, 0, 0, .18);
}

.input-group label {
  /* min-width: 140px; */
  text-align: right;
  border: 5px;
  background:rgba(0, 0, 0, .04);
  padding: 7px 1em;
  font-size: 11pt;
  color: rgba(0, 0, 0, .6);
  flex: 1;
}

.input-group label,
.input-group input {
  align-self: stretch;
}

.input-group input {
  box-shadow: none;
  border: none;
  border-left: 1px solid rgba(0, 0, 0, .2);
  max-width: 100%;
  background: transparent;
}

.input-group label ~ input {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  max-width: 60%;
  flex-shrink: 1;
  flex-basis: 60%;
}
</style>
