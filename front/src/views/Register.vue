<template>
  <div class="d-flex flex-col login ml-auto mr-auto">

    <h1>Sign up</h1>

    <Error v-if="error" :error="error" :round="true"
      @dismiss="() => this.error = null"/>

    <form @submit="onSubmit">

      <img :src="profilePicture" class="profile-pic large d-block ml-auto mr-auto" />

      <button class="secondary">Change picture</button>

      <div class="input-group flex-1 mt-1">
        <input type="email" id="emailInput" v-model="email" class="input" placeholder="Email">
      </div>

      <div class="input-group flex-1 mt-1">
        <input type="text" id="usernameInput" v-model="username" class="input" placeholder="Username">
      </div>

      <div class="input-group flex-1 mt-1">
        <input type="password" id="passwordInput" v-model="password" class="input" placeholder="Password">
      </div>

      <div class="input-group flex-1 mt-1">
        <input type="password" id="password2Input" v-model="password2" class="input" placeholder="Confirm password">
      </div>

      <AsyncButton type="submit" class="suggested mt-5 pl-5 pr-5"
        :fn="onSubmit"
      >
        Sign up
      </AsyncButton>

      <small class="d-block mt-3">
        Already have an account?
        <router-link to="/login" class="secondary">Sign in!</router-link>
      </small>
    </form>

    <!-- <div class="errors" v-if="error">
      {{ error }}
    </div> -->
  </div>
</template>

<script>
import Error from '@/components/Error.vue';
import AsyncButton from '@/components/AsyncButton.vue';

export default {
  data() {
    return {
      email: null,
      username: null,
      password: null,
      password2: null,
      error: null,
      loading: false,
      profilePicture: 'https://imgur.com/IqlHUiV.png',
    };
  },
  components: {
    Error,
    AsyncButton
  },
  methods: {
    async onSubmit(e) {
      // Prevent form submit
      e.preventDefault();
      if (!(this.email && this.password && this.username && this.password2))
        return ;
      if (this.password !== this.password2) {
        this.error = "Passwords don't match.";
        return ;
      }
      // Reset error message
      this.error = null;

      try {
        let payload = {
             email: this.email,
          password: this.password,
          username: this.username,
           picture: this.picture,
        };
        await this.$store.dispatch('register', payload);
        this.$router.push('/');
      }
      catch(err) {
        if (err.response && err.response.data.error)
          this.error = err.response.data.error;
      }
    },
    onForgotPass(e) {
      e.preventDefault();
    },
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  max-width: 300px;
}
</style>
