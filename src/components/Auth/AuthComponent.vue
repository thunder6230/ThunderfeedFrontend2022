<script setup lang="ts">
import { useThunderFeedStore} from "@/stores/thunderfeed";
import LoginComponent from "@/components/Auth/LoginComponent.vue"
import RegisterComponent from "@/components/Auth/RegisterComponent.vue"
const thunderFeedStore = useThunderFeedStore()
</script>

<template>
  <div class="bg-black bg-opacity-50 w-full h-full flex justify-center items-center fixed top-0 z-6000" @click="thunderFeedStore.closeAuth()">
    <div @click.stop class="modalContent bg-amber-50 w-96 rounded-md shadow-md shadow-amber-400">
      <TransitionGroup name="fade" duration="300">
        <LoginComponent v-show="thunderFeedStore.auth.isLoginActive" :key="1"/>
        <RegisterComponent v-show="thunderFeedStore.auth.isRegisterActive" :key="2"/>
      </TransitionGroup>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active{
  transition: all 0.5s ease-out;
  transform: translateX(0);
}
.fade-enter-from,
.fade-enter-to{
  transform: translateX(-100%);
  opacity: 0;
  position: absolute;
}
</style>