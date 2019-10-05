<template>
  <div>
    <h1>Validate</h1>
    <div class="error" v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      errorMessage: null
    };
  },
  mounted() {
    this.errorMessage = null;
    this.$http.post(`/api/auth/validate/${this.$route.params.tok}`)
      .then(data => console.log(data.response))
      .catch(err => {
        if (err.response && err.response.data.error)
          this.errorMessage = err.response.data.error;
        else
          this.errorMessage = 'Error: could not contact server.'
      });
  }
}
</script>
