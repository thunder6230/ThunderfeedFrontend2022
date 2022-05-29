<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import { ref } from "vue";
import TailwindClasses from "@/utilities/TailwindClasses";
import AddPostFileListComponent from "@/components/UserPost/AddPostFileListComponent.vue";

const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();

let formData = new FormData();
const postBody = ref("");
const files = ref<string[]>([]);
const handleSubmit = async () => {
  formData.set("userId", thunderFeedStore.getUserId.toString());
  formData.set("body", postBody.value);
  const result = await thunderFeedStore.addPost(formData);
  toastStore.showToast(result);
  if (result.type == "Success") {
    formData = new FormData();
    postBody.value = "";
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
  <form
    :class="TailwindClasses.ADD_POST_ELEMENT_STYLE"
    @submit.prevent="handleSubmit()"
    enctype="multipart/form-data"
  >
    <div class="relative">
      <input
        type="text"
        :class="TailwindClasses.INPUT_STYLE"
        class="w-full"
        style="margin: 0; margin-right: 0.5em"
        v-model="postBody"
      />
      <div class="absolute flex right-3.5 -inset-y-1/2">
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
            multiple
            name=""
            id="file"
            class="hidden"
            @change="onFileChange($event)"
          />
        </label>
        <div class="flex items-center justify-center">
          <button type="submit" class="w-full flex items-center justify-center">
            <font-awesome-icon
              icon="message"
              :class="TailwindClasses.ADD_POST_BUTTONS_STYLE"
            />
          </button>
        </div>
      </div>
    </div>
    <TransitionGroup name="list" tag="ul">
      <AddPostFileListComponent
        v-for="(file, index) in files"
        :key="file"
        :file="file"
        :index="index"
        @deleteFile="handleDeleteFile($event)"
      />
    </TransitionGroup>
  </form>
</template>

<style scoped></style>
