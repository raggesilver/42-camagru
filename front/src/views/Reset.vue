<template>
  <div>
    <h1>Reset password</h1>
    <div class="content text-center">
      <Error v-if="error" :error="error" :round="true" class="mb-3"
        @dismiss="() => error = null" />

      <p v-if="msg">{{ msg }}</p>

      <p v-if="!tok" class="mb-3">
        Please verify your email to reset your password.
      </p>

      <form v-else class="d-flex flex-col flex-ai-center">

        <p class="text-muted">
          To complete your password reset please input the new password.
        </p>

        <div class="input-group d-flex flex-row flex-wrap flex-ai-center flex-jc-center w-100 mv-5">
          <span class="mr-1">New password</span>
          <input type="password" v-model="password" class="flex-1 input">
        </div>

        <AsyncButton class="button suggested mt-5" type="submit" :fn="validate">
          Reset password
        </AsyncButton>
      </form>

    </div>
  </div>
</template>

<script>
import Error from '@/components/Error.vue';
import AsyncButton from '@/components/AsyncButton.vue';
import axios from 'axios';

export default {
  data() {
    return {
      error: null,
      tok: null,
      msg: null,
      password: null,
      resetting: false,
    };
  },
  components: {
    Error,
    AsyncButton,
  },
  methods: {
    async validate(e) {
      e.preventDefault();
      this.error = null;

      if (!this.tok || this.resetting)
        return ;

      if (!this.password || this.password === '')
        return this.error = 'Password is required';

      this.resetting = true;

      try {
        const payload = { tok: this.tok, password: this.password };
        let { data } = await axios.post(`/api/auth/reset_password`, payload);

        this.msg = 'Password reset successfully!';
        this.$store.commit('setUser', data.user);
        this.$store.commit('setToken', data.token);
        this.$router.push('/');
      }
      catch(err) {
        if (err.response) {
          this.error = err.response.data.error;
        }
        else
          err;
      }
      finally {
        this.resetting = false;
      }
    },
  },
  mounted() {
    if (this.$route.query.tok && this.$route.query.tok !== '') {
      this.tok = this.$route.query.tok;
    }
  },
}
</script>

<style scoped>
.content {
  max-width: 500px;
  margin: 0 auto;
}

input[type="password"] {
  max-width: 300px;
}
</style>
