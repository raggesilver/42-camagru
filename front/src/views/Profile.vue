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
      <button class="icon-button" @click="() => this.editing = !this.editing"
        v-if="isme">
        <v-icon name="user-edit"/>
      </button>
    </div>

    <form class="d-flex flex-ai-start flex-1 pt-2 editor flex-col"
      v-if="isme && editing" @submit="editProfile" @reset="resetEdit">

      <Error v-if="editError" :error="editError" class="w-100"
        @dismiss="() => editError = null" />

      <h3>Edit profile</h3>

      <div class="input-group d-flex flex-ai-center w-100 mb-1">
        <span>Email</span>
        <input type="email" class="input flex-1" v-model="email">
      </div>

      <div class="input-group d-flex flex-ai-center w-100 mb-1">
        <span>Username</span>
        <input type="text" v-model="username" class="input flex-1">
      </div>

      <div class="checkbox-group mv-1">
        <input type="checkbox" v-model="changePassword">
        <span>Change password</span>
      </div>

      <div class="vertical-slider w-100" :class="{ show: changePassword }"
        style="max-height: 300px">
        <div class="input-group d-flex flex-ai-center w-100 mb-1">
          <span>Old password</span>
          <input type="password" v-model="oldPassword" class="input flex-1">
        </div>

        <div class="input-group d-flex flex-ai-center w-100 mb-1">
          <span>New password</span>
          <input type="password" v-model="newPassword" class="input flex-1">
        </div>
      </div>

      <h5 class="mt-3 mb-2">Settings</h5>

      <div class="checkbox-group mv-1">
        <input type="checkbox" v-model="emailNotify">
        <span>Receive email notifications on likes and comments</span>
      </div>

      <div class="d-flex flex-jc-end flex-1 w-100 mt-3">
        <button class="button warning mr-2" type="reset">
          Discard changes
        </button>
        <AsyncButton class="button suggested" type="submit" :fn="editProfile">
          Save changes
        </AsyncButton>
      </div>

    </form>

    <Feed v-if="posts" :source="posts" class="mt-5" v-show="!editing"/>

    <div v-if="loading" class="ml-auto mr-auto mt-2 text-center">
      <v-icon name="circle-notch" spin scale="2"/>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import Feed from '@/components/Feed.vue';
import Error from '@/components/Error.vue';
import AsyncButton from '@/components/AsyncButton.vue';

export default {
  data() {
    return {
      isme: false,
      user: null,
      posts: null,
      error: null,
      loading: true,
      editing: false,
      // Editing fields
      email: null,
      username: null,
      oldPassword: null,
      newPassword: null,
      editError: null,
      changePassword: false,
      emailNotify: true,
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
      if (this.$store.state.user.username == this.$route.params.username ||
          this.$route.params.username == 'me')
        this.isme = true;

      axios.get(`/api/user/profile/${this.$route.params.username}`)
        .then(({data}) => {
          this.user = data.user;
          this.posts = data.posts;

          if (this.$route.hash !== '')
            setTimeout(() => location.href = this.$route.hash, 2000);
        })
        .catch((err) => {
          if (err.response)
            this.error = err.response.data.error;
        })
        .finally(() => this.loading = false);
    },
    resetAll() {
      this.user = null;
      this.posts = null;
      this.loading = true;
      this.isme = false;
      this.username = this.$store.state.user.username;
      this.email = this.$store.state.user.email;
      this.emailNotify = this.$store.state.user.settings.email_notify;
    },
    resetEdit(e) {
      e.preventDefault();
      this.username = this.$store.state.user.username;
      this.email = this.$store.state.user.email;
      this.emailNotify = this.$store.state.user.settings.email_notify;
      this.oldPassword = this.newPassword = null;
      this.changePassword = false;
    },
    async editProfile(e) {
      e.preventDefault();

      this.editError = null;
      let payload = {};

      if (this.changePassword) {
        if (!(this.oldPassword && this.newPassword))
          return this.editError = 'Password is required';
        if (this.oldPassword === this.newPassword)
          return this.editError = 'New password is the same as old password';
        // Append passwords to payload
        payload.oldPassword = this.oldPassword;
        payload.newPassword = this.newPassword;
      }

      if (this.email && this.email != this.$store.state.user.email)
        payload.email = this.email;

      if (this.username && this.username != this.$store.state.user.username)
        payload.username = this.username;

      if (this.emailNotify != this.$store.state.user.settings.email_notify)
        payload['settings.email_notify'] = this.emailNotify;

      if (Object.keys(payload).length == 0)
        return this.editError = 'Nothing has changed';

      try {
        let { data: user } = await axios.post('/api/user/update', payload);

        if (!user.verified) {
          this.$store.commit('setUser', null);
          this.$router.push('/validate');
          this.$router.go();
          return ;
        }

        this.$store.commit('setUser', user);

        if (this.$route.params.username != user.username)
          this.$router.replace({ params: { username: user.username } });

        this.resetAll();
        this.getProfile();
      }
      catch(err) {
        if (err.response)
          this.editError = err.response.data.error;
        else
          err;
      }
    },
  },
  watch: {
    // When route changes, reload user info. Unless changing from self <--> me
    $route(to, from) {
      let me = this.$store.state.user.username;
      if ((to.params.username == 'me' && from.params.username == me) ||
          to.params.username == me && from.params.username == 'me')
        return ;
      this.resetAll();
      this.getProfile();
    },
  },
  mounted() {
    // Model variables
    this.resetAll();
    this.getProfile();
  },
  components: {
    Feed,
    Error,
    AsyncButton,
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

.input-group span {
  border: 5px;
  background:rgba(0, 0, 0, .04);
  padding: 7px 1em;
  font-size: 10pt;
  color: rgba(0, 0, 0, .6);
  flex: 1;
  max-width: 140px;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.input-group input {
  box-shadow: none;
  border: none;
  border-left: 1px solid rgba(0, 0, 0, .2);
  max-width: 100%;
  background: transparent;
}

.input-group span ~ input {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  flex: 1;
  align-self: stretch;
}

.checkbox-group {
  font-size: 10pt;
  color:rgba(0, 0, 0, .6);
  display: flex;
  text-align: left;
  align-items: flex-start;
  justify-content: center;
}

.checkbox-group input {
  margin-right: .5em;
}
</style>
