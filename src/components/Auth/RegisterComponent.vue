<script setup lang="ts">
import { computed, reactive } from "vue";
import { useThunderFeedStore } from "@/stores/thunderfeed";
import type { RegisterModel } from "@/models/AuthModels";
import { useToastStore } from "@/stores/Toast";
import useVuelidate from "@vuelidate/core";
import TailwindClasses from "@/utilities/TailwindClasses";
import {
  alpha,
  email,
  minLength,
  required,
  sameAs,
} from "@vuelidate/validators";
import InputWithErrorMessages from "@/components/Helpers/InputWithErrorMessages.vue";

const toastStore = useToastStore();

const thunderFeedStore = useThunderFeedStore();
const registerData = reactive<RegisterModel>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  password_confirm: "",
  gender: "",
});
const rules = computed(() => ({
  firstName: { required, alpha, minLength: minLength(3), $autoDirty: true },
  lastName: { required, alpha, minLength: minLength(3), $autoDirty: true },
  email: { required, email, minLength: minLength(6), $autoDirty: true },
  password: { required, minLength: minLength(8), $autoDirty: true },
  password_confirm: {
    required,
    sameAs: sameAs(registerData.password),
    $autoDirty: true,
  },
  gender: { required },
}));
const v$ = useVuelidate(rules, registerData);

const sendRegister = async () => {
  const valid = await v$.value.$validate();
  if (!valid) return;
  const isRegisterSuccessful = await thunderFeedStore.register(registerData);
  toastStore.showToast(isRegisterSuccessful);
};
const nameErrorMessage = (message: string, name: string): string => {
  return message.replace("Value", capitalizedName(name));
};

const capitalizedName = (name: string) => {
  return `${name[0].toUpperCase()}${name.slice(1)}`;
};
</script>

<template>
  <div
    @click.stop
    class="modalContent bg-amber-50 w-96 rounded-md shadow-md shadow-amber-400"
  >
    <form class="flex flex-col px-6 py-4" @submit.prevent="sendRegister()">
      <h3 class="font-semibold text-3xl text-center my-3 text-amber-700">
        Register
      </h3>

      <InputWithErrorMessages
        @newInput="registerData.firstName = $event"
        :errors="v$.firstName.$errors"
        :placeholder="'Firstname'"
      />
      <InputWithErrorMessages
        @newInput="registerData.lastName = $event"
        :errors="v$.lastName.$errors"
        :placeholder="'Lastname'"
      />
      <InputWithErrorMessages
        @newInput="registerData.email = $event"
        :errors="v$.email.$errors"
        :placeholder="'Email'"
      />
      <InputWithErrorMessages
        @newInput="registerData.password = $event"
        :errors="v$.password.$errors"
        placeholder="Password"
        type="password"
      />
      <InputWithErrorMessages
        @newInput="registerData.password_confirm = $event"
        :errors="v$.password_confirm.$errors"
        placeholder="Password Confirm"
        type="password"
      />
      <div>
        <label for="female">
          <input
            type="radio"
            name="gender"
            id="female"
            value="female"
            v-model="registerData.gender"
          />
          Female
        </label>
        <label for="male">
          <input
            type="radio"
            name="gender"
            id="male"
            value="male"
            v-model="registerData.gender"
          />
          Male
        </label>
        <TransitionGroup
          name="list"
          class="text-red-500 font-semibold"
          tag="ul"
        >
          <li v-for="error in v$.gender.$errors" :key="error.$uid">
            {{
              nameErrorMessage(
                error.$message.toString(),
                error.$property.toString()
              )
            }}
          </li>
        </TransitionGroup>
      </div>
      <button @click="sendRegister()" :class="TailwindClasses.BUTTON_STYLE">
        Register
      </button>
      <small
        @click="thunderFeedStore.goToLogin()"
        class="text-center text-amber-700 font-semibold cursor-pointer"
        >Already have an Account? Click here!</small
      >
    </form>
  </div>
</template>

<style></style>
