<template>
  <div class="comment">
    <p>
      <router-link :to="`/profile/${comment.username}`" class="username"
      >{{ comment.username }}</router-link>
      <span v-html="compText"></span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    comment: Object
  },
  computed: {
    compText: function () {
      // Hack to prevent HTML injection
      let node = document.createElement('div');
      node.innerText = this.$props.comment.text;
      return ' ' + node.innerHTML.replace(
          /(#[^\s.,#]+)/gm, '<span class="hashtag">$1</span>');
    }
  }
}
</script>

<style scoped>
.comment {
  display: inline-block;
}

a.username {
  color: #2c3e50;
  text-decoration: none;
  font-weight: bold;
}

p {
  margin-top: 0;
}
</style>

<style>
.hashtag {
  color: #42b983;
}
</style>
