<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import PostComponent from "@/components/UserPost/PostComponent.vue";
import AddPostComponent from "@/components/UserPost/AddPostComponent.vue";

const thunderFeedStore = useThunderFeedStore();
const props = defineProps<{
  userTo?: string;
}>();
</script>
<template>
  <section class="flex flex-col items-center w-full">
    <Transition name="slide-in" appear>
      <AddPostComponent
        v-if="thunderFeedStore.userLoggedIn"
        :user-to="props.userTo"
      />
    </Transition>

    <TransitionGroup
      appear
      name="list"
      class="flex flex-col items-center w-full"
      tag="ul"
      v-if="thunderFeedStore.posts.length > 0"
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
