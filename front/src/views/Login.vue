<template>
  <div class="d-flex flex-col login ml-auto mr-auto">

    <h1>Sign in</h1>

    <Error v-if="error" :error="error" :round="true"
      @dismiss="() => this.error = null"/>

    <form @submit="onSubmit">
      <div class="input-group flex-1 mt-1">
        <input type="text" id="emailInput" v-model="username" class="input" placeholder="Username">
      </div>

      <div class="input-group flex-1 mt-1">
        <input type="password" id="passwordInput" v-model="password" class="input" placeholder="Password">
      </div>

      <AsyncButton type="submit" class="suggested mt-5 pl-5 pr-5"
        :fn="onSubmit"
      >
        Sign in
      </AsyncButton>

      <small class="d-block mt-3 text-muted">
        Don't have an account?
        <router-link to="/register">Sign up!</router-link>
      </small>

      <small class="d-block mt-1">
        <a href="#" class="secondary" @click="onForgotPass">Forgot password</a>
      </small>
    </form>

  </div>
</template>

<script>
import Error from '@/components/Error.vue';
import AsyncButton from '@/components/AsyncButton.vue';
import axios from 'axios';

export default {
  data() {
    return {
      username: null,
      password: null,
      error: null,
      loading: false,
      resetting: false,
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
      if (!(this.username && this.password))
        return ;
      // Reset error message
      this.error = null;

      try {
        let res = await this.$store
          .dispatch('login', { username: this.username, password: this.password });
        if (res.data.user.verified)
          this.$router.push('/');
        else
          this.$router.push('/validate');
      }
      catch(err) {
        if (err.response && err.response.data.error)
          this.error = err.response.data.error;
      }
    },
    onForgotPass(e) {
      e.preventDefault();

      this.error = null;

      if (this.resetting)
        return ;

      if (!this.username)
        return this.error = 'Username required for password reset';

      this.resetting = true;
      axios.post('/api/auth/reset_request', { username: this.username })
        .then(() => {
          this.$router.push('/resetpassword');
        })
        .catch((err) => {
          if (err.response)
            this.error = err.response.data.error;
          else
            console.log(err);
        })
        .finally(() => this.resetting = false);
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
