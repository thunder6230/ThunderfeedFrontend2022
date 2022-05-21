<script setup lang="ts" >
import {ref} from "vue"
import { useThunderFeedStore} from "@/stores/thunderfeed";
import type { RegisterModel } from "@/models/AuthModels";
import { useToastStore} from "@/stores/Toast";
const toastStore = useToastStore();

const thunderFeedStore = useThunderFeedStore()
const registerData = ref<RegisterModel>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  password_confirm: "",
  gender: ""
})
const sendRegister = async () => {
  if(!validateRegister()) return
  const isRegisterSuccessful = await thunderFeedStore.register(registerData.value)
  toastStore.showToast(isRegisterSuccessful)
}
const validateRegister = () => {
  return true
}

//Tailwind object Styles
const inputStyle =  "mb-3 placeholder-amber-700 text-lg text-amber-500 focus:outline-none focus:border-amber-500 py-1 px-2 rounded-md border-amber-700 border-2 hover:border-amber-500 transition"
const buttonStyle = "w-full bg-amber-50 rounded-md mb-1 font-semibold text-xl py-1 text-amber-700 hover:text-amber-50 hover:bg-amber-700 border-2 border-amber-700 transition"

</script>

<template>
  <form class="flex flex-col px-6 py-4" @submit.prevent="sendRegister()">
    <h3 class="font-semibold text-3xl text-center my-3 text-amber-700">Register</h3>

      <input type="text" placeholder="Firstname"
             :class="inputStyle"
             v-model="registerData.firstName">
      <input type="text" placeholder="Lastname"
             :class="inputStyle"
             v-model="registerData.lastName">
      <input type="text" placeholder="Email"
             :class="inputStyle"
             v-model="registerData.email">
      <input type="password"
             placeholder="Password"
             :class="inputStyle"
             v-model="registerData.password">
      <input type="password"
             placeholder="Password Confirm"
             :class="inputStyle"
             v-model="registerData.password_confirm">
      <div>
        <label for="">

        <input type="radio" name="gender" id="" value="female" v-model="registerData.gender">
          Female
        </label>
        <label for="">
        <input type="radio" name="gender" id="" value="male" v-model="registerData.gender">
          Male
        </label>

      </div>
    <button @click="sendRegister()"
            :class="buttonStyle">Register</button>
    <small @click="thunderFeedStore.goToLogin()" class="text-center text-amber-700 font-semibold cursor-pointer">Already have an Account? Click here!</small>
  </form>
</template>

<style>

</style>