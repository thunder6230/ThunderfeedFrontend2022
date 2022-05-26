<script setup lang="ts" >
import {ref} from "vue"
import { useThunderFeedStore} from "@/stores/thunderfeed";
import type { LoginModel } from "@/models/AuthModels";
import { useToastStore} from "@/stores/Toast";
import type { ToastModel } from "@/models/HelperModels";
const thunderFeedStore = useThunderFeedStore()
const toastStore = useToastStore()
const loginData = ref<LoginModel>({
  email: "",
  password: "",
  rememberMe: false
})
const sendLogin = async () => {
    if(!validateLogin()) return
  const toastData: ToastModel = {
      message: "",
    type: ""
  }
  const loggedIn = await thunderFeedStore.login(loginData.value)
  if (loggedIn.type == "Success") thunderFeedStore.closeAuth()
  return toastStore.showToast(loggedIn)

}
const validateLogin = () => {
  return true
}
//Tailwind object Styles
const inputStyle = [ "mb-3 placeholder-amber-700 text-lg text-amber-500 focus:outline-none focus:border-amber-500 py-1 px-2 rounded-md border-amber-700 border-2 hover:border-amber-500 transition "]
const buttonStyle = ["w-full bg-amber-50 rounded-md mb-1 font-semibold text-xl py-1 text-amber-700 hover:text-amber-50 hover:bg-amber-700 border-2 border-amber-700 transition"]

</script>

<template>
  <div @click.stop class="modalContent bg-amber-50 w-96 rounded-md shadow-md shadow-amber-400">
  <form class="flex flex-col px-6 py-4" @submit.prevent="sendLogin()" >
    <h3 class="font-semibold text-3xl text-center mb-3 text-amber-700">Login</h3>
      <input type="text" placeholder="Email"
             :class="inputStyle"
             v-model="loginData.email">
      <input type="password" placeholder="Password"
             :class="inputStyle"
             v-model="loginData.password">
    <label for="" class="mb-3 text-amber-700 font-semibold"><input type="checkbox" name="" id="" class="mr-2 border-2 text-amber-700" v-model="loginData.rememberMe">Remember me</label>
    <button type="submit" :class="buttonStyle"
            >Login</button>
      <small @click="thunderFeedStore.goToRegister()" class="cursor-pointer text-center text-amber-700 font-semibold">Don't have an Account? Click here!</small>


<!--    <button @click="thunderFeedStore.getWeather()">Get Weather</button>-->
  </form>
  </div>
</template>

<style>

</style>