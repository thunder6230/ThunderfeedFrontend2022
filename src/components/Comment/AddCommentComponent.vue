<script setup lang="ts">
import { useThunderFeedStore} from "@/stores/thunderfeed";
import { useToastStore} from "@/stores/Toast";
import { onMounted, ref } from "vue";
const thunderFeedStore = useThunderFeedStore()
const toastStore = useToastStore()
import  TailwindClasses  from "@/utilities/TailwindClasses"
import type { AddCommentParams, AddPostParams } from "@/models/HelperModels";
const props = defineProps<{
  postId: number,
  index: number
}>()
const input = ref(null)
onMounted(() => {
  if(input.value != undefined) input.value.focus()
})
const params = ref<AddCommentParams>({
  userId: thunderFeedStore.getUserId,
  postId: props.postId,
  body: "",
  file: null
})
const emit = defineEmits(['commentAdded'])
const handleSubmit = async () => {
  const result = await thunderFeedStore.addComment(params.value)
  emit("commentAdded", result.comment)
  toastStore.showToast(result)

}
const onFileChange = (files: any[]) => {
  if (!files.length) return;
  params.value.file = files[0]
}
</script>

<template>
  <div class="flex ">
    <div :class="TailwindClasses.COMMENT_IMAGE_DIV_STYLE"></div>
    <form @submit.prevent="handleSubmit" class="relative w-11/12">
      <input type="text" class="w-full rounded-full " :class="TailwindClasses.INPUT_STYLE" style="margin-bottom: 0;" v-model="params.body" id="addCommentInput" ref="input">
      <div class="absolute flex right-1 -inset-y-1/2">
        <label for="" class=" cursor-pointer flex items-center justify-center">
          <font-awesome-icon icon="file-image" :class="TailwindClasses.ADD_POST_BUTTONS_STYLE" class="p-2" />
          <input type="file" name="" id="" class="hidden" @change="onFileChange($event.target.files)" >

        </label>
        <div class=" flex items-center justify-center">
          <button type="submit" class="w-full flex items-center justify-center" >
            <font-awesome-icon icon="comment-dots" :class="TailwindClasses.ADD_POST_BUTTONS_STYLE"/></button>
        </div>

      </div>
    </form>


  </div>
</template>

<style scoped>

</style>