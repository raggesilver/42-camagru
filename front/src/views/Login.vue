<template>
  <div class="d-flex flex-col login ml-auto mr-auto">

    <h1>Sign in</h1>

    <Error v-if="errorMessage" :error="errorMessage" :round="true"
      @dismiss="() => this.errorMessage = null"/>

    <form @submit="onSubmit">
      <div class="input-group flex-1 mt-1">
        <input type="email" id="emailInput" v-model="email" class="input" placeholder="Email">
      </div>

      <div class="input-group flex-1 mt-1">
        <input type="password" id="passwordInput" v-model="password" class="input" placeholder="Password">
      </div>

      <AsyncButton type="submit" class="suggested mt-2 pl-5 pr-5"
        :fn="onSubmit"
      >
        Login
      </AsyncButton>
    </form>

    <!-- <div class="errors" v-if="errorMessage">
      {{ errorMessage }}
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
      password: null,
      errorMessage: null,
      loading: false
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
      if (!(this.email && this.password))
        return ;
      // Reset error message
      this.errorMessage = null;

      try {
        await this.$store
          .dispatch('login', { email: this.email, password: this.password });
        this.$router.push('/');
      }
      catch(err) {
        if (err.response && err.response.data.error)
          this.errorMessage = err.response.data.error;
      }
    }
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  max-width: 300px;
}
</style>
