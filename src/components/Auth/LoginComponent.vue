<script setup lang="ts">
import { ref } from "vue";
import { useThunderFeedStore } from "@/stores/thunderfeed";
import type { LoginModel } from "@/models/AuthModels";
import { useToastStore } from "@/stores/Toast";
import TailwindClasses from "@/utilities/TailwindClasses";
import { email, required, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import InputWithErrorMessages from "@/components/Helpers/InputWithErrorMessages.vue";

const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const loginData = ref<LoginModel>({
  email: "",
  password: "",
  rememberMe: false,
});
const v$ = useVuelidate(
  {
    email: { required, email, minLength: minLength(6), $autoDirty: true },
    password: { required, $autoDirty: true },
  },
  loginData
);

const sendLogin = async () => {
  const valid = await v$.value.$validate();
  if (!valid) return;
  const loggedIn = await thunderFeedStore.login(loginData.value);
  if (loggedIn.type == "Success") thunderFeedStore.closeAuth();
  return toastStore.showToast(loggedIn);
};
</script>

<template>
  <div
    @click.stop
    class="modalContent bg-amber-50 w-96 rounded-md shadow-md shadow-amber-400"
  >
    <form class="flex flex-col px-6 py-4" @submit.prevent="sendLogin()">
      <h3 class="font-semibold text-3xl text-center mb-3 text-amber-700">
        Login
      </h3>

      <InputWithErrorMessages
        @newInput="loginData.email = $event"
        :errors="v$.email.$errors"
        placeholder="Email"
      />
      <InputWithErrorMessages
        @newInput="loginData.password = $event"
        :errors="v$.password.$errors"
        placeholder="Password"
        type="password"
      />
      <label for="" class="mb-3 text-amber-700 font-semibold">
        <input
          type="checkbox"
          name=""
          id=""
          class="mr-2 border-2 text-amber-700"
          v-model="loginData.rememberMe"
        />Remember me</label
      >
      <button type="submit" :class="TailwindClasses.BUTTON_STYLE">Login</button>
      <small
        @click="thunderFeedStore.goToRegister()"
        class="cursor-pointer text-center text-amber-700 font-semibold"
        >Don't have an Account? Click here!</small
      >
    </form>
  </div>
</template>

<style></style>
