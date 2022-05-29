<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import { onMounted, ref } from "vue";
import type { EditPostparams } from "@/models/HelperModels";
import TailwindClasses from "@/utilities/TailwindClasses";

const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();

const props = defineProps<{
  body: string;
  postId: number;
}>();
const propsCopy = { ...props };
const params = ref<EditPostparams>({
  userId: thunderFeedStore.getUserId,
  postId: propsCopy.postId,
  body: propsCopy.body,
  file: null,
});
const emit = defineEmits(["postEdited"]);
const handleEdit = async () => {
  params.value.body = propsCopy.body;
  const response = await thunderFeedStore.updatePost(params.value);
  if (response == undefined) return;
  emit("postEdited", response.newBody);
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
