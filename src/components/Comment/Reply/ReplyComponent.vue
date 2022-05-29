<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import TailwindClasses from "@/utilities/TailwindClasses";
import { ref } from "vue";
import type { AddReplyLikeParams } from "@/models/HelperModels";
import EditReplyComponent from "@/components/Comment/Reply/EditReplyComponent.vue";

const props = defineProps<{
  reply: any;
  index: number;
}>();
const propsCopy = { ...props };
const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const getFullName = (fname: string, lname: string): string => {
  return `${fname} ${lname}`;
};
const handleLike = async (replyId: number, replyLikes: Array<any>) => {
  console.log(replyLikes);
  const iLiked = checkLike(replyLikes);
  if (iLiked) return removeLike();
  return addLike(replyId);
};
const addLike = async (replyId: number) => {
  const params: AddReplyLikeParams = {
    replyId: replyId,
    userId: thunderFeedStore.getUserId,
  };
  const likeResponse = await thunderFeedStore.addReplyLike(params);
  console.log(likeResponse);
  propsCopy.reply.likes.push(likeResponse.like);
  toastStore.showToast(likeResponse);
  myLikeId.value = likeResponse.like.id;
};
const removeLike = async () => {
  const likeResponse = await thunderFeedStore.removeLike(myLikeId.value);
  if (likeResponse.id && likeResponse.id > 0) {
    propsCopy.reply.likes = propsCopy.reply.likes.filter((like: any) => {
      like.id != likeResponse.id;
    });
  }
  toastStore.showToast(likeResponse);
};

const myLikeId = ref<number>(-1);
const checkLike = (likes: Array<any>) => {
  const count = likes.filter(
    (like) => like.user.id == thunderFeedStore.getUserId
  );
  if (count.length == 0) return false;
  myLikeId.value = count[0].id;
  return true;
};
const emit = defineEmits(["deletedReply", "addReply"]);
const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this Post?")) return;
  const deleteResponse = await thunderFeedStore.deleteReply(propsCopy.reply.id);
  emit("deletedReply", deleteResponse.id);
  toastStore.showToast(deleteResponse);
};
const isEditActive = ref(false);
const handleEditInput = (newBody: string) => {
  propsCopy.reply.body = newBody;
  isEditActive.value = false;
};
</script>
<template>
  <li class="flex my-2">
    <RouterLink to="/">
      <div :class="TailwindClasses.COMMENT_IMAGE_DIV_STYLE"></div>
    </RouterLink>
    <div :class="TailwindClasses.REPLY_CONTENT_STYLE">
      <RouterLink to="/" class="font-semibold text-black m-0 text-sm">
        {{
          getFullName(
            propsCopy.reply.user.firstName,
            propsCopy.reply.user.lastName
          )
        }}
      </RouterLink>
      <TransitionGroup name="slide-in" tag="div" class="w-full">
        <EditReplyComponent
          :reply-id="propsCopy.reply.id"
          :body="propsCopy.reply.body"
          v-if="isEditActive"
          @replyEdited="handleEditInput($event)"
          @focusout="isEditActive = false"
        />
        <p class="font-semibold text-amber-900 text-lg leading-3" v-else>
          {{ propsCopy.reply.body }}
        </p>
      </TransitionGroup>
      <div :class="TailwindClasses.COMMENT_ACTIONS_STYLE">
        <button
          :class="TailwindClasses.COMMENT_ACTION_BUTTON_STYLE"
          @click="handleLike(propsCopy.reply.id, propsCopy.reply.likes)"
        >
          {{ checkLike(propsCopy.reply.likes) ? "Don't Like" : "Like" }}
        </button>
        <button
          :class="TailwindClasses.COMMENT_ACTION_BUTTON_STYLE"
          @click="emit('addReply')"
        >
          Reply
        </button>
        <button
          :class="TailwindClasses.COMMENT_ACTION_BUTTON_STYLE"
          v-if="propsCopy.reply.user.id == thunderFeedStore.getUserId"
          @click="isEditActive = true"
        >
          Edit
        </button>
        <button
          :class="TailwindClasses.COMMENT_ACTION_BUTTON_STYLE"
          @click="
            handleDelete(propsCopy.reply.id, propsCopy.reply.likes, index)
          "
          v-if="propsCopy.reply.user.id == thunderFeedStore.getUserId"
        >
          Delete
        </button>
      </div>
    </div>
  </li>
</template>

<style scoped>
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
  transform: translateY(-30px);
  position: absolute;
}
</style>
