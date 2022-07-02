<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import AuthComponent from "@/components/Auth/AuthComponent.vue";
import ToastMessageComponent from "@/components/Helpers/ToastMessageComponent.vue";
import tailwindClasses from "@/utilities/TailwindClasses";
import { useToastStore } from "@/stores/Toast";
import { useThunderFeedStore } from "@/stores/thunderfeed";
import "animate.css";
import NavbarComponent from "@/components/Navbar/NavbarComponent.vue";

const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const handleLogout = async () => {
  const isLoggedOut = await thunderFeedStore.logOut();
  toastStore.showToast(isLoggedOut);
};
const { NAV_LINK_STYLE, HEADER_STYLE } = tailwindClasses;
thunderFeedStore.checkUserLoggedIn();
</script>

<template>
  <NavbarComponent />
  <RouterView v-slot:="{ Component }">
    <Transition
      appear
      enter-active-class="animate__animated animate__fadeInRight"
      leave-active-class="animate__animated animate__fadeOutLeft"
    >
      <Component :is="Component" class="py-24 absolute w-full" />
    </Transition>
  </RouterView>

  <Transition
    appear
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <AuthComponent class="authModal" v-if="thunderFeedStore.auth.isAuthOpen" />
  </Transition>

  <Transition name="slide-top">
    <ToastMessageComponent v-if="toastStore.isActive" />
  </Transition>
</template>

<style lang="scss" scoped>
.router-link-exact-active {
  border-bottom: 2px solid white;
}
</style>
<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
  transform: translateY(-30px);
  position: absolute;
}

.slide-top-enter-active {
  transition: all 1s ease-out;
}

.slide-top-leave-active {
  transition: all 0.8s ease-out;
}

.slide-top-enter-from,
.slide-top-enter-to {
  transform: translateY(-60px);
  opacity: 0;
  position: absolute;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-out;
}

.fade-enter-from,
.fade-enter-to {
  opacity: 0;
  position: absolute;
}

.bounce-in-enter-active,
.bounce-in-leave-active {
  transition: all 0.5s ease;
}

.bounce-in-enter-from,
.bounce-in-leave-to {
  opacity: 0;
  transform: scale(1.2);
}
</style>
