<template>
  <div class="comment">
    <p>
      <router-link :to="`/profile/${comment.user.username}`" class="username"
      >{{ comment.user.username }}</router-link>
      <small v-html="compText"></small>
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
  },
}
</script>

<style scoped>

a.username {
  color: #2c3e50;
  text-decoration: none;
  font-weight: bold;
}

p {
  margin: 0;
}

.comments .comment:nth-child(2) p {
  margin-top: .5em;
}
</style>

<style>
.comments {
  padding-bottom: .75em;
}

.hashtag {
  color: #42b983;
}
</style>
