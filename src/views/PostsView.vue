<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import { onMounted } from "vue";
import Index from "@/components/UserPost/PostsIndex.vue";
const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
onMounted(async () => {
  const response = await thunderFeedStore.getPosts();
  toastStore.showToast(response);
});
</script>

<template>
  <Index />
</template>
