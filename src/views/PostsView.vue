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
    <Transition name="slide-in" appear>
      <AddPostComponent v-if="thunderFeedStore.userLoggedIn"/>
    </Transition>
    <TransitionGroup appear name="list" v-if="thunderFeedStore.posts.length > 0" class="flex flex-col items-center w-full" tag="ul">
        <PostComponent v-for="(post, index) in thunderFeedStore.posts" :key="post.id" :post="post" :index="index" />
    </TransitionGroup>
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
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}
.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
  transform: translateY(-30px);
  position: absolute;
}
</style>
