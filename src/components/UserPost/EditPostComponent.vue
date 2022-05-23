<script setup lang="ts">
import { useThunderFeedStore} from "@/stores/thunderfeed";
import { useToastStore} from "@/stores/Toast";
import { onMounted, ref } from "vue";
const thunderFeedStore = useThunderFeedStore()
const toastStore = useToastStore()
import  TailwindClasses  from "@/utilities/TailwindClasses"
import type { AddCommentParams, AddPostParams, EditCommentParams, EditPostparams } from "@/models/HelperModels";
const props = defineProps<{
  body: string,
  postId:number
}>();
const propsCopy = {...props}
const params = ref<EditPostparams>({
  userId: thunderFeedStore.getUserId,
  postId: propsCopy.postId,
  body: propsCopy.body,
  file: null
})
const emit = defineEmits(['postEdited'])
const handleEdit = async (newBody:string) => {
  params.value.body = newBody
  const result = await thunderFeedStore.updatePost(params.value)
  emit("postEdited", result.newBody)
  toastStore.showToast(result)

}
const onFileChange = (files: any[]) => {
  if (!files.length) return;
  params.value.file = files[0]
}
const input= ref(null);
onMounted(() => {
  if(input.value != undefined) input.value.focus()
})
</script>

<template>
      <input type="text" class="w-full" :class="TailwindClasses.INPUT_STYLE" style="margin-bottom: 0;" v-model="propsCopy.body" ref="input" @change="handleEdit($event.target.value)">
</template>

<style scoped>

</style>