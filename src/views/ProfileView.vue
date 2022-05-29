<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import { onMounted } from "vue";
import PostComponent from "@/components/UserPost/PostComponent.vue";
import AddPostComponent from "@/components/UserPost/AddPostComponent.vue";
import { useRoute } from "vue-router";
const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const route = useRoute();
onMounted(async () => {
  const userId = route.params.id.toString();
  const response = await thunderFeedStore.getUserPosts(userId);
  toastStore.showToast(response);
});
</script>

<template>
  <section class="flex flex-col items-center w-full">
    <Transition name="slide-in" appear>
      <AddPostComponent v-if="thunderFeedStore.userLoggedIn" />
    </Transition>
    <TransitionGroup
      appear
      name="list"
      v-if="thunderFeedStore.posts.length > 0"
      class="flex flex-col items-center w-full"
      tag="ul"
    >
      <PostComponent
        v-for="(post, index) in thunderFeedStore.posts"
        :key="post.id"
        :post="post"
        :index="index"
      />
    </TransitionGroup>
    <h3 v-else>There are No posts yet</h3>
  </section>
</template>

<style scoped></style>
