<script setup lang="ts">

import { useThunderFeedStore} from "@/stores/thunderfeed";
import { useToastStore} from "@/stores/Toast";
import { onMounted } from "vue";
import PostComponent from "@/components/UserPost/PostComponent.vue";
import AddPostComponent from "@/components/UserPost/AddPostComponent.vue";
const thunderFeedStore = useThunderFeedStore()
const toastStore = useToastStore()
onMounted(async () => {
  const loadPosts =  await thunderFeedStore.getPosts()
  toastStore.showToast(loadPosts)
})
</script>

<template>
  <section class="flex flex-col items-center w-full ">
    <AddPostComponent />
    <section v-if="thunderFeedStore.posts.length > 0" class="flex flex-col items-center w-full">
        <PostComponent v-for="(post, index) in thunderFeedStore.posts" :key="post.id + post.likes.length" :post="post" :index="index" />
    </section>
    <h3 v-else>There are No posts yet</h3>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active{
  transition: all 0.5s ease-out;
}
.fade-enter-from,
.fade-enter-to{
  opacity: 0;
  position: absolute;
}
</style>
