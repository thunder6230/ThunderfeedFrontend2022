<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import { onMounted, ref } from "vue";
import type { EditReplyParams } from "@/models/HelperModels";
import TailwindClasses from "@/utilities/TailwindClasses";
const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const props = defineProps<{
  body: string;
  replyId: number;
}>();
onMounted(() => {
  const input = document.getElementById("editCommentInput");
  if (input != undefined) input.focus();
});
const propsCopy = { ...props };
const params = ref<EditReplyParams>({
  userId: thunderFeedStore.getUserId,
  replyId: propsCopy.replyId,
  body: propsCopy.body,
  file: null,
});
const emit = defineEmits(["replyEdited"]);
const handleEdit = async () => {
  params.value.body = propsCopy.body;
  const result = await thunderFeedStore.updateReply(params.value);
  emit("replyEdited", result.newBody);
  toastStore.showToast(result);
};
const onFileChange = (files: any[]) => {
  if (!files.length) return;
  params.value.file = files[0];
};
const input = ref<HTMLInputElement>();
onMounted(() => {
  if (input.value != undefined) input.value.focus();
});
</script>

<template>
  <input
    type="text"
    class="w-full"
    :class="TailwindClasses.INPUT_STYLE"
    style="margin-bottom: 0"
    v-model="propsCopy.body"
    ref="input"
    @change="handleEdit()"
  />
</template>

<style scoped></style>
