<script setup lang="ts">
defineProps<{
  name: string;
  element: object;
}>();
</script>
<template>
  <div>
    <strong>{{ name }}</strong> liked your Reply
  </div>
</template>

<style scoped></style>
