<script setup lang="ts">
const props = defineProps<{
  name: string;
  element: {
    element: string;
    elementId: number;
  };
}>();
console.log(props)
</script>
<template>
  <RouterLink :to="`/Posts/${props.element.elementId}`" >
    <div>
      <strong>{{ name }}</strong>
      liked your Post</div>
  </RouterLink>
</template>

<style scoped></style>
