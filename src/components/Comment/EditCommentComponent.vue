<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import TailwindClasses from "@/utilities/TailwindClasses";
import type { EditCommentParams } from "@/models/HelperModels";
import { onMounted, ref } from "vue";
const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const props = defineProps<{
  body: string;
  commentId: number;
}>();
onMounted(() => {
  const input = document.getElementById("editCommentInput");
  if (input != undefined) input.focus();
});
const propsCopy = { ...props };
const params = ref<EditCommentParams>({
  userId: thunderFeedStore.getUserId,
  commentId: propsCopy.commentId,
  body: propsCopy.body,
  file: null,
});
const emit = defineEmits(["commentEdited"]);
const handleEdit = async () => {
  params.value.body = propsCopy.body;
  const result = await thunderFeedStore.updateComment(params.value);
  emit("commentEdited", result.newBody);
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
