<template>
  <div class="feed-card">
    <!-- Post header (profile picture, username) -->
    <div class="header">
      <img class="profile-pic" :src="post.user.picture">
      <!-- Flex username -->
      <div class="info">
        <router-link :to="`/profile/${post.user.username}`" class="username"
        >{{ post.user.username }}
        </router-link>
      </div>
      <button class="icon-button flex-right">
        <v-icon name="ellipsis-h"/>
      </button>
    </div>
    <!-- Foreach image in post -->
    <img v-for="(img, i) in post.media" :key="i" :src="img">
    <!-- Div with action buttons (like, comment) -->
    <div class="actions">
      <button v-if="!post.liked" class="icon-button">
        <v-icon name="regular/heart" scale="1.5"/>
      </button>
      <button v-else class="icon-button">
        <v-icon name="heart" style="color: red;" scale="1.5"/>
      </button>
      <button class="icon-button">
        <v-icon name="regular/comment" scale="1.5"/>
      </button>
    </div>
    <div class="comments">
      <Comment :comment="{ username: post.user.username, text: post.text }"/>
    </div>
  </div>
</template>

<script>
import Comment from '@/components/Comment.vue';

export default {
  props: {
    post: Object
  },
  data() {
    return {
      comments: [],
    };
  },
  components: {
    Comment,
  },
}
</script>

<style scoped>
.header {
  display: flex;
  padding: calc(1em - 6px) 0;
}

.header .name {
  font-weight: bold;
  font-size: larger;
}

.header .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: .5em;
}

.header a,
.header a:visited {
  color: #2c3e50;
  text-decoration: none;
  font-weight: bold;
  font-size: 11pt;
}

img:not(.profile-pic) {
  max-width: calc(100% + 2em);
  margin: 0 -1em;
}

.feed-card {
  max-width: 600px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  border-radius: 5px;
  padding: 6px 1em;
  padding-bottom: 0;
  margin: 0 auto;
  text-align: left;
}

.feed-card:not(:last-child) {
  margin-bottom: 2em;
}

.actions {
  padding-top: .5em;
  padding-bottom: .25em;
}

.actions button {
  margin: 0;
  margin-right: 1em;
  padding-left: 0;
  padding-right: 0;
}
</style>
