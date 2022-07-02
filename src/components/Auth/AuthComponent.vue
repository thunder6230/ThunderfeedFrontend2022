<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import LoginComponent from "@/components/Auth/LoginComponent.vue";
import RegisterComponent from "@/components/Auth/RegisterComponent.vue";

const thunderFeedStore = useThunderFeedStore();
</script>

<template>
  <div
    class="bg-black bg-opacity-50 w-full h-full flex justify-center items-center fixed top-0 z-6000"
    @click="thunderFeedStore.closeAuth()"
  >
    <Transition
      enter-active-class="animate__animated animate__bounceIn"
      leave-active-class="animate__animated animate__bounceOut"
      mode="out-in"
      appear
    >
      <Component
        :is="
          thunderFeedStore.auth.isRegisterActive
            ? RegisterComponent
            : LoginComponent
        "
      />
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-out;
}

.fade-enter-from,
.fade-enter-to {
  transform: translateX(-100%);
  opacity: 0;
  position: absolute;
}

.list-up-enter-active,
.list-up-leave-active {
  transition: all 0.3s ease;
}

.list-up-enter-from,
.list-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
  position: absolute;
}
</style>
