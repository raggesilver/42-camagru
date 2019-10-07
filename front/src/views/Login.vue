<template>
  <div class="login">
    <form @submit="onSubmit">
      <div class="input-group">
        <label for="emailInput">Email</label>
        <input type="email" id="emailInput" v-model="email">
      </div>

      <div class="input-group">
        <label for="passwordInput">Password</label>
        <input type="password" id="passwordInput" v-model="password">
      </div>

      <input type="submit" value="Login" :disabled="loading">
    </form>

    <div class="errors" v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: null,
      password: null,
      errorMessage: null,
      loading: false
    };
  },
  methods: {
    onSubmit(e) {
      // Prevent form submit
      e.preventDefault();
      if (!(this.email && this.password))
        return ;
      // Reset error message
      this.errorMessage = null;

      this.$store
        .dispatch('login', { email: this.email, password: this.password })
        .then(() => this.$router.push('/'))
        .catch(err => {
          if (err.response && err.response.data.error)
            this.errorMessage = err.response.data.error;
        });
    }
  }
}
</script>

<style scoped>
.login input:not([type="submit"]) {
  width: 200px;
}

.input-group {
  margin: .5em 0;
}

.input-group label {
  display: block;
}
</style>
