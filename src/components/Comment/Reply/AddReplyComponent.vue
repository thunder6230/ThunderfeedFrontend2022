<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import TailwindClasses from "@/utilities/TailwindClasses";
import { onMounted, ref } from "vue";
import type { EditCommentParams } from "@/models/HelperModels";

const props = defineProps<{
  commentId: number;
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
  const response = await thunderFeedStore.addReply(params.value);
  if (response == undefined) return;
  emit("replyAdded", response.reply);
  toastStore.showToast(response);
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
