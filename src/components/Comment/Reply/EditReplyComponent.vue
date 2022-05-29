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
  const response = await thunderFeedStore.updateReply(params.value);
  if (response == undefined) return;
  emit("replyEdited", response.newBody);
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
