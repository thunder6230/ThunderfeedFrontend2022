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
  const response = await thunderFeedStore.updateComment(params.value);
  if (response == undefined) return;
  emit("commentEdited", response.newBody);
  toastStore.showToast(response);
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
