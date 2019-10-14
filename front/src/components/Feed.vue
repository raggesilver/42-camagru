<template>
  <div class="feed">
    <FeedCard v-for="post in posts" :key="post._id" :post="post"/>
    <div v-show="loading || end" style="margin: 6em 0;">
      <v-icon v-show="loading" name="circle-notch" spin scale="2"/>
      <p v-show="end" style="margin: 0;" class="text-muted">
        Looks like you've reached the end.
        <v-icon name="regular/flag" />
      </p>
    </div>
  </div>
</template>

<script>
import FeedCard from '@/components/FeedCard.vue';
import axios from 'axios';

export default {
  props: {
    source: {
      type: Array,
      required: false,
      default: null
    },
  },
  data() {
    return {
      posts: [],
      // Keep track wheter we reached the end of posts or not
      end: false,
      loading: false
    };
  },
  components: {
    FeedCard
  },
  // watch: {
  //   loading(_new) {
  //     if (_new && this.atBottom())
  //       this.$nextTick(() => {
  //         window.scrollTo(0, document.body.scrollHeight);
  //       });
  //   },
  //   end(_new) {
  //     if (_new && this.atBottom())
  //       this.$nextTick(() => {
  //         window.scrollTo(0, document.body.scrollHeight);
  //       });
  //   }
  // },
  methods: {
    atBottom() {
      return Math.ceil(window.pageYOffset + window.innerHeight) >=
        document.documentElement.offsetHeight;
    },
    onScroll() {
      if (this.atBottom())
        this.fetchPosts();
    },
    fetchPosts() {
      // Skip if reached end
      if (this.end || this.loading)
        return ;

      this.loading = true;

      axios.get(`/api/post?offset=${this.posts.length}`)
        .then(({ data }) => {
          if (data.length > 0)
            data.forEach(el => this.posts.push(el));
          // If the length of the array was less than 10 save that we reached
          // the end
          if (data.length < 10)
            this.end = true;
        })
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
    }
  },
  mounted() {
    // If there is a source we don't need to connect anything
    if (this.$props.source) {
      this.posts = this.$props.source;
    }
    else {
      // Get initial posts
      this.fetchPosts();

      this.$bus.$on('new-post', (post) => {
        this.posts.unshift(post);
      });

      window.onscroll = this.onScroll;
    }
  }
}
</script>

<style>
</style>
