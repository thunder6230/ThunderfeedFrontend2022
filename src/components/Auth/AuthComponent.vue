<script setup lang="ts">
import { useThunderFeedStore} from "@/stores/thunderfeed";
import LoginComponent from "@/components/Auth/LoginComponent.vue"
import RegisterComponent from "@/components/Auth/RegisterComponent.vue"
const thunderFeedStore = useThunderFeedStore()
</script>

<template>
  <div class="bg-black bg-opacity-50 w-full h-full flex justify-center items-center fixed top-0 z-6000" @click="thunderFeedStore.closeAuth()">
    <TransitionGroup name="list-up">
      <LoginComponent v-if="thunderFeedStore.auth.isLoginActive" :key="1" />
      <RegisterComponent v-if="thunderFeedStore.auth.isRegisterActive" :key="2" />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active{
  transition: all 0.5s ease-out;
}
.fade-enter-from,
.fade-enter-to{
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