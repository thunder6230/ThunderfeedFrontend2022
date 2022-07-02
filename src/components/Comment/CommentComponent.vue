<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import TailwindClasses from "@/utilities/TailwindClasses";
import { ref } from "vue";
import type { AddCommentLikeParams } from "@/models/HelperModels";
import EditCommentComponent from "@/components/Comment/EditCommentComponent.vue";
import AddReplyComponent from "@/components/Comment/Reply/AddReplyComponent.vue";
import ReplyComponent from "@/components/Comment/Reply/ReplyComponent.vue";
import type { Comment, Like, Reply } from "@/models/storeModel";
import { getFullName } from "@/components/Helpers/Functions";

const props = defineProps<{
  comment: Comment;
  index: number;
}>();
const propsCopy = { ...props };
const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const { firstName, lastName } = propsCopy.comment.user;
const name = getFullName(firstName, lastName);
const handleLike = async (postId: number, commentLikes: Array<Like>) => {
  const iLiked = checkLike(commentLikes);
  if (iLiked) return removeLike();
  return addLike(postId);
};
const addLike = async (commentId: number) => {
  const params: AddCommentLikeParams = {
    commentId: commentId,
    userId: thunderFeedStore.getUserId,
  };
  const response = await thunderFeedStore.addCommentLike(params);
  if (response == undefined) return;
  const { like } = response;
  if (like != undefined) {
    propsCopy.comment.likes.push(like);
    toastStore.showToast(response);
    myLikeId.value = like.id;
  }
};
const removeLike = async () => {
  const response = await thunderFeedStore.removeLike(myLikeId.value);
  if (response == undefined) return;
  if (response.id) {
    propsCopy.comment.likes = Object.values(propsCopy.comment.likes).filter(
      (like: Like) => like.id != response.id
    );
  }
  toastStore.showToast(response);
};

const myLikeId = ref<number>(-1);
const checkLike = (likes: Array<Like>) => {
  const count = likes.filter(
    (like: Like) => like.userId == thunderFeedStore.getUserId
  );
  if (count.length == 0) return false;
  myLikeId.value = count[0].id;
  return true;
};
const emit = defineEmits(["deletedComment"]);
const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this Post?")) return;
  const response = await thunderFeedStore.deleteComment(propsCopy.comment.id);
  if (response == undefined) return;
  emit("deletedComment", response.id);
  toastStore.showToast(response);
};
const isEditActive = ref(false);
const isAddReplyActive = ref(false);
const handleEditInput = (newBody: string) => {
  propsCopy.comment.body = newBody;
  isEditActive.value = false;
};
const handleAddedReply = (reply: Reply) => {
  propsCopy.comment.replies.push(reply);
  isAddReplyActive.value = false;
};
const handleReplyDelete = (replyId: number) => {
  propsCopy.comment.replies = propsCopy.comment.replies.filter(
    (reply: Reply) => reply.id != replyId
  );
};
</script>
<template>
  <li class="flex mb-2">
    <RouterLink :to="`/profile/${propsCopy.comment.user.id}/posts`">
      <div :class="TailwindClasses.COMMENT_IMAGE_DIV_STYLE"></div>
    </RouterLink>
    <div class="flex flex-col w-11/12">
      <div :class="TailwindClasses.COMMENT_CONTENT_STYLE">
        <RouterLink
          :to="`/profile/${propsCopy.comment.user.id}/posts`"
          class="font-semibold text-black m-0 text-sm"
        >
          {{ name }}
        </RouterLink>
        <TransitionGroup name="slide-in" tag="div" class="w-full">
          <EditCommentComponent
            :comment-id="propsCopy.comment.id"
            :body="propsCopy.comment.body"
            v-if="isEditActive"
            @commentEdited="handleEditInput($event)"
            @focusout="isEditActive = false"
            :key="1"
          />
          <p
            class="font-semibold text-amber-900 text-lg leading-3"
            v-else
            :key="2"
          >
            {{ propsCopy.comment.body }}
          </p>
        </TransitionGroup>
        <div :class="TailwindClasses.COMMENT_ACTIONS_STYLE">
          <button
            :class="TailwindClasses.COMMENT_ACTION_BUTTON_STYLE"
            @click="handleLike(propsCopy.comment.id, propsCopy.comment.likes)"
          >
            {{ checkLike(propsCopy.comment.likes) ? "Don't Like" : "Like" }}
          </button>
          <button
            :class="TailwindClasses.COMMENT_ACTION_BUTTON_STYLE"
            @click="isAddReplyActive = true"
          >
            Reply
          </button>
          <button
            :class="TailwindClasses.COMMENT_ACTION_BUTTON_STYLE"
            v-if="propsCopy.comment.user.id == thunderFeedStore.getUserId"
            @click="isEditActive = true"
          >
            Edit
          </button>
          <button
            :class="TailwindClasses.COMMENT_ACTION_BUTTON_STYLE"
            @click="
              handleDelete(propsCopy.comment.id, propsCopy.comment.likes, index)
            "
            v-if="propsCopy.comment.user.id == thunderFeedStore.getUserId"
          >
            Delete
          </button>
        </div>
      </div>
      <TransitionGroup name="list" tag="ul" appear>
        <ReplyComponent
          v-for="(reply, index) in propsCopy.comment.replies"
          :key="reply.body"
          :reply="reply"
          :index="index"
          @deletedReply="handleReplyDelete($event)"
          @addReply="isAddReplyActive = true"
        />
        <AddReplyComponent
          v-if="isAddReplyActive"
          @replyAdded="handleAddedReply($event)"
          :comment-id="propsCopy.comment.id"
        />
      </TransitionGroup>
    </div>
    <!--        COmments-->
    <!--      COmmentsENd-->
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
