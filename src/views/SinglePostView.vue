<script setup lang="ts">
import PostComponent from "@/components/UserPost/PostComponent.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const id = route.params.id.toString();
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <Suspense>
      <template #default>
        <PostComponent :single-post="{ isSingle: true, id: id }" />
      </template>
      <template #fallback> Loading... </template>
    </Suspense>
  </div>
</template>
