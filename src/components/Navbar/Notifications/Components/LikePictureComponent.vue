<script setup lang="ts">
defineProps<{
  name: string;
  element: { element: string; id: number };
}>();
</script>
<template>
  <div>
    <strong>{{ name }}</strong> liked your Picture
  </div>
</template>

<style scoped></style>
