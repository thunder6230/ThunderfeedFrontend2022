<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>
<template>
  <RouterLink to="/">
    <div>
      <strong>{{ name }}</strong> liked your Comment
    </div>
  </RouterLink>
</template>

<style scoped></style>
