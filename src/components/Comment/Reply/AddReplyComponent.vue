<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import TailwindClasses from "@/utilities/TailwindClasses";
import { onMounted, ref } from "vue";
import type {
  EditCommentParams,
} from "@/models/HelperModels";

const props = defineProps<{
  commentId: any;
}>();
const propsCopy = { ...props };
const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const emit = defineEmits(["replyAdded"]);
const input = ref<HTMLInputElement>();
onMounted(() => {
  if (input.value != undefined) input.value.focus();
});
const params = ref<EditCommentParams>({
  userId: thunderFeedStore.getUserId,
  commentId: propsCopy.commentId,
  body: "",
  file: null,
});
const handleSubmit = async () => {
  const result = await thunderFeedStore.addReply(params.value);
  emit("replyAdded", result.reply);
  toastStore.showToast(result);
};
const onFileChange = (files: any[]) => {
  if (!files.length) return;
  params.value.file = files[0];
};
</script>
<template>
  <li class="flex mt-2">
    <RouterLink to="/">
      <div :class="TailwindClasses.COMMENT_IMAGE_DIV_STYLE"></div>
    </RouterLink>
    <div :class="TailwindClasses.REPLY_CONTENT_STYLE">
      <input
        type="text"
        class="w-full px-2 py-1 text-amber-900 font-semibold bg-transparent text-lg focus:outline-0"
        ref="input"
        @change="handleSubmit"
        v-model="params.body"
      />
    </div>
  </li>
</template>

<style scoped></style>
