<script setup lang="ts">
import { RouterLink } from "vue-router";
import tailwindClasses from "@/utilities/TailwindClasses";
import { useToastStore } from "@/stores/Toast";
import { useThunderFeedStore } from "@/stores/thunderfeed";
import "animate.css";
import { onMounted } from "vue";
import NavbarNotificationComponent from "@/components/Navbar/Notifications/NavbarNotificationComponent.vue";

const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const handleLogout = async () => {
  const isLoggedOut = await thunderFeedStore.logOut();
  toastStore.showToast(isLoggedOut);
};
const { NAV_LINK_STYLE, HEADER_STYLE } = tailwindClasses;
onMounted(async () => {
  await thunderFeedStore.getUnreadNotifications();
});
</script>
<template>
  <header>
    <section :class="HEADER_STYLE">
      <div class="flex items-center">
        <font-awesome-icon
          icon="feed"
          width="25"
          height="25"
          class="text-amber-50 font-semibold mr-2"
        />

        <TransitionGroup
          tag="div"
          class="flex"
          enter-active-class="animate__animated animate__lightSpeedInRight"
          leave-active-class="animate__animatedanimate__lightSpeedOutRight"
        >
          <RouterLink to="/" :class="NAV_LINK_STYLE" :key="1"
            >Posts
          </RouterLink>
          <RouterLink to="/about" :class="NAV_LINK_STYLE" :key="2"
            >About
          </RouterLink>

          <RouterLink to="/Future" :class="NAV_LINK_STYLE" :key="4"
            >Future Plans
          </RouterLink>
          <RouterLink
            to="/Friends"
            :class="NAV_LINK_STYLE"
            v-if="thunderFeedStore.userLoggedIn"
            :key="3"
            >Friends
          </RouterLink>
          <NavbarNotificationComponent v-if="thunderFeedStore.userLoggedIn" />
        </TransitionGroup>
      </div>
      <div class="right">
        <TransitionGroup name="slide-in">
          <nav v-if="!thunderFeedStore.userLoggedIn" :key="1">
            <button
              :class="NAV_LINK_STYLE"
              @click="thunderFeedStore.openAuthRegister()"
            >
              Register
            </button>
            <button
              :class="NAV_LINK_STYLE"
              @click="thunderFeedStore.openAuthLogin()"
            >
              Login
            </button>
          </nav>
          <nav v-else :key="2">
            <RouterLink
              :to="`/profile/${thunderFeedStore.getUserId}/posts`"
              :class="NAV_LINK_STYLE"
              >My Profile</RouterLink
            >
            <button @click="handleLogout()" :class="NAV_LINK_STYLE">
              Logout
            </button>
          </nav>
        </TransitionGroup>
      </div>
    </section>
  </header>
</template>

<style scoped></style>
