<template>
  <div>
    <h1>Validate</h1>
    <div class="content text-center">
      <Error v-if="error" :error="error" :round="true"
        @dismiss="() => error = null" />

      <p v-if="msg">
        {{ msg }}
      </p>

      <p v-if="!tok" class="mb-3">
        Please verify your email to validate your account.
      </p>

      <button class="secondary" :disabled="canResendIn || resending"
        @click="resendEmail">
        {{ canResendIn ? `Resend available in ${canResendIn}s` : 'Resend email' }}
      </button>
    </div>
  </div>
</template>

<script>
import Error from '@/components/Error.vue';
import axios from 'axios';

export default {
  data() {
    return {
      error: null,
      tok: null,
      msg: null,
      canResendIn: null,
      count: 1,
      resending: false,
    };
  },
  components: {
    Error,
  },
  methods: {
    startResendCountdown() {
      this.canResendIn = this.count * 15;
      setTimeout(this.resendTick, 1000);
      this.count++;
    },
    resendTick() {
      if (this.canResendIn > 1) {
        this.canResendIn--;
        setTimeout(this.resendTick, 1000);
      } else {
        this.canResendIn = null;
      }
    },
    resendEmail() {
      if (this.canResendIn)
        return ;

      this.msg = null;
      this.error = null;
      this.resending = true;

      axios.post('/api/auth/revalidate')
        .then(({ data }) => {
          if (data.msg == 'ALREADY_VERIFIED') {
            this.$store.commit('setUser', null);
            this.$router.push('/');
          }
          else
            this.msg = data.msg;
          // 4 * 15 = 60 seconds. Wait one minute before successful resend
          this.count = 4;
        })
        .catch((err) => {
          if (err.response)
            this.error = err.response.data.error;
          // No err.response indicates am unhandled internal error, so the
          // countdown is increased (since the bug probably won't be fixed soon)
          else
            this.count += 2;
        })
        .finally(() => {
          this.resending = false;
          this.startResendCountdown();
        });
    },
    validate() {
      this.error = null;
      axios.post(`/api/auth/validate/${this.tok}`)
        .then(({ data }) => {
          this.msg = 'Verified successfully!';
          data.user.verified = true;
          this.$store.commit('setUser', data.user);
          this.$router.push('/');
        })
        .catch(err => {
          if (err.response && err.response.data.error) {
            this.error = err.response.data.error;
            this.tok = null;
          }
          else
            err;
        });
    },
  },
  mounted() {
    if (this.$store.state.user && this.$store.state.user.verified) {
      this.$router.push('/');
    } else if (this.$route.query.tok) {
      this.tok = this.$route.query.tok;
      // this.$router.replace('/validate');
      this.validate();
    } else {
      this.startResendCountdown();
    }
  }
}
</script>

<style scoped>
.content {
  max-width: 500px;
  margin: 0 auto;
}
</style>
