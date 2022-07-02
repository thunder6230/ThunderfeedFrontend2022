<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import { onMounted, ref } from "vue";
import PostComponent from "@/components/UserPost/PostComponent.vue";
import type { Post } from "@/models/storeModel";
import { useRoute } from "vue-router";
const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const route = useRoute();
const id = route.params.id.toString();
const post = ref();

</script>

<template>
    <div class="flex flex-col items-center w-full">
  <Suspense>
      <template #default>
      <PostComponent :single-post="{isSingle:true, id: id}" />
      </template>
      <template #fallback>
        Loading...
      </template>

  </Suspense>
    </div>

</template>
