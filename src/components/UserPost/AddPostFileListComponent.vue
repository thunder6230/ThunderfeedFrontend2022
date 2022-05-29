<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  file: string;
  index: number;
}>();
const showDeleteButton = ref(false);
</script>
<template>
  <li
    class="px-1 py-1 flex items-center w-full justify-between"
    @mouseenter="showDeleteButton = true"
    @mouseleave="showDeleteButton = false"
  >
    {{ file }}
    <transition name="bounce-in">
      <font-awesome-icon
        icon="circle-minus"
        class="text-red-500 hover:rotate-180 transition ml-2 text-lg cursor-pointer"
        @click="$emit('deleteFile', props.index)"
        v-if="showDeleteButton"
      ></font-awesome-icon>
    </transition>
  </li>
</template>

<style scoped></style>
