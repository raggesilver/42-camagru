<template>
  <div v-if="logged" class="feed-card">
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
      <button class="icon-button flex-right">
        <v-icon name="ellipsis-v" scale="0.85" />
      </button>
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
        .catch(err => console.log(err));
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
          console.log(data);
          if (data.comment)
            this.$props.post.comments.push(data.comment);
          this.comment = null;
        })
        .catch((err) => console.log(err))
        .finally(() => this.commenting = false);
    },
    onShowNewComment() {
      this.showComment = !this.showComment;
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
</style>
