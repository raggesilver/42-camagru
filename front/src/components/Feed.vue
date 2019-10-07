<template>
  <div class="feed">
    <FeedCard v-for="post in posts" :key="post._id" :post="post"/>
  </div>
</template>

<script>
import FeedCard from '@/components/FeedCard.vue';

export default {
  data() {
    return {
      posts: [
        {
          _id: 'asljkdnq23984yeabks',
          user: {
            _id: 'uasbdfk39304571kbdaf',
            name: 'Paulo Queiroz',
            picture: 'https://i.imgur.com/6esjDFB.png',
            username: 'pvaqueiroz',
          },
          text: 'I can do #hashtags',
          media: [
            // 'https://i.imgur.com/6esjDFB.png',
            'https://imgur.com/sAgtXEA.png'
          ],
        },
      ]
    };
  },
  components: {
    FeedCard
  }
}
</script>

<style>

</style>
