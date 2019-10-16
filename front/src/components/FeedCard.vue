<template>
  <div v-if="logged" class="feed-card" :id="`post-${post._id}`">
    <!-- Post header (profile picture, username) -->
    <div class="header">
      <img class="profile-pic" :src="post.user.picture">
      <!-- Flex username -->
      <div class="info">
        <router-link :to="`/profile/${post.user.username}`" class="username"
        >{{ post.user.username }}
        </router-link>
      </div>
      <!-- Flex post time -->
      <div class="info">
        <!-- margin-top: 3px fixes alignment issue due to different font sizes
        -->
        <span class="text-muted" style="font-size: 9pt; margin-top: 3px;">
          {{ postDate }}
        </span>
      </div>

      <button v-if="isMine" class="icon-button flex-right"
        @click="showMenu = !showMenu">
        <v-icon v-if="showMenu" name="times" scale="0.85" class="fa-fw times"/>
        <v-icon v-else name="ellipsis-v" scale="0.85" class="fa-fw"/>
      </button>

      <!-- Menu -->
      <div v-if="isMine" class="menu" :class="{ show: showMenu }">
        <ul>
          <li class="disabled flex-ai-center">
            <span class="mr-2">Edit post</span>
            <v-icon name="pencil-alt" scale="0.6" class="ml-auto"/>
          </li>
          <li class="flex-ai-center" @click="deletePost">
            <span class="mr-2">Delete post</span>
            <v-icon name="trash" scale="0.6" class="ml-auto"/>
          </li>
        </ul>
      </div>
    </div>
    <!-- Foreach image in post -->
    <img v-for="(img, i) in post.media" :key="i" :src="img"
      loading="lazy" decode="async" />
    <!-- Div with action buttons (like, comment) -->
    <div class="actions">
      <!-- Like button -->
      <button class="icon-button" @click="onLikeClicked">
        <v-icon v-if="liked" name="heart" style="color: rgb(237, 73, 68);"
          scale="1" />
        <v-icon v-else name="regular/heart" scale="1" />
        <span v-if="post.user._id === user._id" class="text-muted">
          {{ likeAmmount }}
        </span>
      </button>
      <!-- Comment button -->
      <button class="icon-button" @click="onShowNewComment">
        <v-icon v-if="showComment" name="comment" scale="1" />
        <v-icon v-else name="regular/comment" scale="1" />
      </button>
    </div>
    <!-- FIXME: There should be a component called CommentSection to manage the
    comments of a post (to handle 'see more') -->
    <!-- Comments section -->
    <div class="comments">
      <!-- First comment has only poster's username and post text -->
      <Comment
        :comment="{ user: { username: post.user.username }, text: post.text }"/>
      <!-- All other comments -->
      <Comment
        v-for="comment in post.comments" :key="comment._id" :comment="comment"/>
    </div>
    <!-- NewComment -->
    <form class="new-comment d-flex flex-row vertical-slider"
      :class="{ show: showComment }"
      :disabled="commenting"
      @submit="onNewComment"
    >
      <input type="text" v-model="comment" class="flex-1"
        placeholder="Write a comment" :disabled="commenting">
      <button class="icon-button" type="submit" :disabled="commenting">
        <v-icon name="regular/paper-plane" />
      </button>
    </form>
  </div>
</template>

<script>
import Comment from '@/components/Comment.vue';
import { timeSince } from '@/modules/moment.js';
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  props: {
    post: Object
  },
  data() {
    return {
      liked: false,
      comment: null,
      commenting: false,
      showComment: false,
      showMenu: false,
      postDate: timeSince(new Date(this.$props.post.createdAt)) + ' ago',
    };
  },
  components: {
    Comment,
  },
  computed: {
    likeAmmount() {
      return this.$props.post.likes.length;
    },
    ...mapState(['user', 'logged']),
    isMine() {
      return this.post.user._id === this.user._id;
    },
  },
  methods: {
    onLikeClicked() {
      axios.post(`/api/post/${this.$props.post._id}/like`)
        .then(({ data }) => {
          this.liked = !!data.liked;
          let ind = this.$props.post.likes.indexOf(this.user._id);
          // If liked and user _id not in likes
          if (this.liked && ind == -1)
            this.$props.post.likes.push(this.user._id);
          // If not liked and user _id in likes
          else if (!this.liked && ind != -1)
            this.$props.post.likes.splice(ind, 1);
        })
        .catch(err => err);
    },
    onNewComment(e) {
      e.preventDefault();
      if (this.comment.trim() == '' || this.commenting)
        return ;
      this.commenting = true;
      axios.post(`/api/post/${this.$props.post._id}/comment`, {
        text: this.comment
      })
        .then(({ data }) => {
          if (data.comment)
            this.$props.post.comments.push(data.comment);
          this.comment = null;
        })
        .catch((err) => err)
        .finally(() => this.commenting = false);
    },
    onShowNewComment() {
      this.showComment = !this.showComment;
    },
    async deletePost() {
      axios.post(`/api/post/${this.post._id}/delete`)
        .then(() => this.$emit('deleteSelf', this))
        .catch((err) => err);
    },
  },
  mounted() {
    this.liked =
      this.$props.post.likes.indexOf(this.user._id) != -1;

    // Hack to update time
    setInterval(() => {
      this.postDate = timeSince(new Date(this.$props.post.createdAt)) + ' ago';
    }, 100);
  }
}
</script>

<style scoped>
.deleted {
  display: none !important;
}

.header {
  display: flex;
  padding: calc(1em - 6px) 0;
  position: relative;
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
  max-width: 500px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  border-radius: 5px;
  padding: 6px 1em;
  padding-bottom: 0;
  margin: 0 auto;
  text-align: left;
  background: white;
}

.feed-card:not(:last-child) {
  margin-bottom: 2em;
}

.actions {
  padding-top: .5em;
}

.actions button {
  margin: 0;
  margin-right: 1em;
  padding-left: 0;
  padding-right: 0;
}

.new-comment {
  margin: 0 -1em;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.new-comment input {
  padding: 1em 1em 1em 2em;
  border: none;
  background: transparent;
  height: 40px;
}

.new-comment button {
  padding-right: 1.5em;
}

.menu {
  position: absolute;
  right: 0;
  top: calc(100% - 1.25em);
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  font-size: 10pt;
  border-radius: 5px;
}

.menu:not(.show) {
  display: none;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu ul li {
  padding: .5em 1em;
  user-select: none;
  display: flex;
}

.menu ul li:not(.disabled) {
  cursor: pointer;
}

.menu ul li.disabled {
  color:rgba(0, 0, 0, 0.4);
}

.menu ul li:not(.disabled):hover {
  background: rgba(0, 0, 0, 0.05);
}

.menu ul li:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

@keyframes times {
  /* 0% { transform: rotate(45deg); } */
  100% { transform: rotate(0deg); }
}

.header .fa-icon {
  width: 15px;
}

.times {
  transform: rotate(45deg);
  animation: times .2s;
  animation-fill-mode: forwards;
}
</style>
