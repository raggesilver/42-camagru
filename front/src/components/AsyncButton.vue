<template>
  <button class="async-button"
    :class="{ loading }"
    :disabled="loading"
    @click="onClick"
  >
    <span class="content">
      <slot/>
    </span>
    <span class="d-flex flex-ai-center flex-jc-center icon">
      <v-icon name="circle-notch" spin/>
    </span>
  </button>
</template>

<script>
export default {
  props: {
    fn: Function,
    context: Object
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async onClick(...args) {
      if (typeof this.$props.fn !== 'function')
        return ;
      this.loading = true;
      await this.$props.fn(...args);
      this.loading = false;
    }
  }
}
</script>

<style scoped>

button.async-button {
  /* min-height: calc(18px + 1.5em); */
  position: relative;
}

button.async-button .icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

button.async-button:not(.loading) .icon {
  display: none;
}

button.async-button.loading .content {
  opacity: 0;
}

button.async-button.loading {
  filter: brightness(85%);
}

button.async-button:not(.loading):hover {
  filter: brightness(97%);
}

</style>
