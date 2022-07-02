<script lang="ts" setup>
import { RouterLink } from "vue-router";
import { useThunderFeedStore } from "@/stores/thunderfeed";
import "../../../../node_modules/animate.css/animate.css";
import tailwindClasses from "@/utilities/TailwindClasses";
import NotificationNavbarElement from "@/components/Navbar/Notifications/NotificationNavbarElement.vue";
import { onMounted, ref } from "vue";

const thunderFeedStore = useThunderFeedStore();
const { NAV_LINK_STYLE } = tailwindClasses;
const isNotificationListOn = ref(false);
const userId = thunderFeedStore.getUserId;
const notificationBall = ref();
onMounted(async () => {
  setInterval(async () => {
    const updateResponse = await thunderFeedStore.getUnreadNotifications();
    if (updateResponse?.updated) {
      if (notificationBall.value != null) {
        notificationBall.value.classList.add("animate__swing");
        setTimeout(
          () => notificationBall.value.classList.remove("animate__swing"),
          2000
        );
      }
    }
  }, 30000);
});
</script>
<template>
  <div
    class="relative"
    @mouseenter="isNotificationListOn = true"
    @mouseleave="isNotificationListOn = false"
  >
    <RouterLink
      :to="`/Notifications/${userId}`"
      class="relative"
      :class="NAV_LINK_STYLE"
      :key="4"
      @click.stop
    >
      Notifications
      <span
        class="absolute w-5 h-5 rounded-full bg-red-600 text-white flex justify-center items-center -right-4 -top-2 text-xs font-bold animate__animated"
        ref="notificationBall"
        >{{ thunderFeedStore.notifications.length }}</span
      >
    </RouterLink>
    <Transition
      enter-active-class="animate__animated animate__bounceInDown"
      leave-active-class="animate__animated animate__bounceOutUp"
    >
      <ul
        class="absolute -left-1/2 border-amber-700 border-2"
        v-if="isNotificationListOn && thunderFeedStore.notifications.length > 0"
        style="width: 400px"
      >
        <NotificationNavbarElement
          v-for="notification in thunderFeedStore.notifications"
          :key="notification.id"
          :notification="notification"
        />
        <li
          class="bg-amber-50 w-full text-amber-900 p-2 hover:bg-amber-300 transition text-amber-900 font-bold text-center w-full"
        >
          <RouterLink :to="`/Notifications/${userId}`"
            >All Notifications
          </RouterLink>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped></style>
