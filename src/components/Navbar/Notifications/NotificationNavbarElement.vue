<script setup lang="ts">
import tailwindClasses from "@/utilities/TailwindClasses";
import type { Notification } from "@/models/storeModel";
import NavbarNotificationBody from "@/components/Navbar/Notifications/Components/NavbarNotificationBody.vue";
const { COMMENT_IMAGE_DIV_STYLE } = tailwindClasses;
const props = defineProps<{
  notification: Notification;
}>();
</script>
<template>
  <li
    class="bg-amber-50 w-full text-amber-900 p-2 hover:bg-amber-300 transition border-amber-200 border-b-2"
  >
    <div class="flex">
      <RouterLink :to="`/profile/${props.notification.userFrom.id}`">
        <div class="imageDiv" :class="COMMENT_IMAGE_DIV_STYLE"></div>
      </RouterLink>
      <NavbarNotificationBody
        class="flex flex-col"
        :notification="props.notification"
      />
    </div>
  </li>
</template>

<style scoped></style>
