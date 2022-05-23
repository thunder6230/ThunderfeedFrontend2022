<script setup lang="ts">
import { useThunderFeedStore} from "@/stores/thunderfeed";
import { useToastStore} from "@/stores/Toast";
import { ref} from "vue";
const thunderFeedStore = useThunderFeedStore()
const toastStore = useToastStore()
import  TailwindClasses  from "@/utilities/TailwindClasses"
import type { AddPostParams } from "@/models/HelperModels";
const params = ref<AddPostParams>({
  userId: thunderFeedStore.getUserId,
  body: "",
  file: null
})
const handleSubmit = async () => {
  // return console.log(params.value)
 const result= await thunderFeedStore.addPost(params.value)
  toastStore.showToast(result)
  if(result.type == "Success") {
    params.value.body = ""
    params.value.file = null
  }

}
const onFileChange = (files: any[]) => {
  if (!files.length) return;
  params.value.file = files[0]
}
</script>

<template>
  <form :class="TailwindClasses.ADD_POST_ELEMENT_STYLE" @submit.prevent="handleSubmit()" enctype="multipart/form-data">
    <input type="text" :class="TailwindClasses.INPUT_STYLE" class="w-full" style="margin: 0;margin-right: 0.5em;" v-model="params.body">
    <div class="absolute flex right-3.5 -inset-y-1/2">
      <label for="" class=" cursor-pointer flex items-center justify-center">
        <font-awesome-icon icon="file-image" :class="TailwindClasses.ADD_POST_BUTTONS_STYLE" class="p-2" />
        <input type="file" name="" id="" class="hidden" @change="onFileChange($event.target.files)" >

      </label>
      <div class=" flex items-center justify-center">
        <button type="submit" class="w-full flex items-center justify-center" >
          <font-awesome-icon icon="message" :class="TailwindClasses.ADD_POST_BUTTONS_STYLE"/></button>

      </div>

    </div>
  </form>
</template>


<style scoped>

</style>