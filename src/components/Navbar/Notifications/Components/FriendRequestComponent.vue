<script setup lang="ts">
defineProps<{
  name: string;
  element: object;
}>();
</script>
<template>
  <div><strong>{{ name }}</strong> wants to be your friend</div>
</template>

<style scoped></style>
