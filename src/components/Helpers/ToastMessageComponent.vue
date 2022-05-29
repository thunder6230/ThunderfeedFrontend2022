<script lang="ts" setup>
import { useToastStore } from "@/stores/Toast";
import { onMounted } from "vue";
const toastStore = useToastStore();
const toastStyle =
  "flex w-full px-4 py-2 h-12 fixed top-12 transition text-amber-50 justify-center items-center";
onMounted(() =>
  setTimeout(() => toastStore.$patch((state) => (state.isActive = false)), 3000)
);
</script>
<template>
  <div :class="`${toastStyle} ${toastStore.activeTheme.Color}`">
    <font-awesome-icon
      :icon="toastStore.activeTheme.Icon"
      class="mr-2"
    ></font-awesome-icon>
    <p class="m-0">{{ toastStore.message }}</p>
  </div>
</template>

<style scoped lang="scss">
//div {
//  visibility: hidden;
//  transform: translateY(-100%);
//  &.active{
//    transform: translateY(0);
//    visibility: visible;
//  }
//}
</style>
