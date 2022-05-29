<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import { onMounted, ref } from "vue";
import TailwindClasses from "@/utilities/TailwindClasses";

const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const props = defineProps<{
  postId: number;
}>();
const input = ref<HTMLInputElement>();
onMounted(() => {
  if (input.value != undefined) input.value.focus();
});
let formData = new FormData();
const commentBody = ref("");
const files = ref<string[]>([]);

const emit = defineEmits(["commentAdded"]);
const handleSubmit = async () => {
  formData.set("userId", thunderFeedStore.getUserId.toString());
  formData.set("postId", props.postId.toString());
  formData.set("body", commentBody.value);
  const result = await thunderFeedStore.addComment(formData);
  toastStore.showToast(result);
  if (result.type == "Success") {
    emit("commentAdded", result.comment);
    formData = new FormData();
    commentBody.value = "";
    files.value = [];
  }
};
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files == null) return;
  const fileList = target.files;
  formData = new FormData();
  files.value = [];
  [...fileList].forEach((file) => {
    formData.append("file", file, file.name);
    files.value.push(file.name);
  });
};
const handleDeleteFile = (indexToDelete: number) => {
  files.value = files.value.filter((file, index) => index != indexToDelete);

  let formDataFiles = formData.getAll("file");
  formDataFiles = formDataFiles.filter((file, index) => index != indexToDelete);
  const filteredFormData = new FormData();
  formDataFiles.forEach((file) => {
    if (file instanceof File) {
      console.log(file.name);
      filteredFormData.append("file", file, file.name);
    }
  });
  formData = filteredFormData;
};
</script>

<template>
  <div class="flex">
    <div :class="TailwindClasses.COMMENT_IMAGE_DIV_STYLE"></div>
    <form
      @submit.prevent="handleSubmit"
      class="relative w-11/12"
      enctype="multipart/form-data"
    >
      <input
        type="text"
        class="w-full rounded-full"
        :class="TailwindClasses.INPUT_STYLE"
        style="margin-bottom: 0"
        v-model="commentBody"
        id="addCommentInput"
        ref="input"
      />
      <div class="absolute flex right-1 -inset-y-1/2">
        <label
          for="file"
          class="cursor-pointer flex items-center justify-center"
        >
          <font-awesome-icon
            icon="file-image"
            :class="TailwindClasses.ADD_POST_BUTTONS_STYLE"
            class="p-2"
          />
          <input
            type="file"
            name=""
            id="file"
            class="hidden"
            @change="onFileChange($event)"
          />
        </label>
        <div class="flex items-center justify-center">
          <button type="submit" class="w-full flex items-center justify-center">
            <font-awesome-icon
              icon="comment-dots"
              :class="TailwindClasses.ADD_POST_BUTTONS_STYLE"
            />
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
