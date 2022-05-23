<script setup lang="ts">
import type { Post } from "@/models/storeModel";
import TailwindClasses from "@/utilities/TailwindClasses";
import { useThunderFeedStore } from "@/stores/thunderfeed";
import type { AddPostLikeParams } from "@/models/HelperModels";
import { useToastStore } from "@/stores/Toast";
import { ref, toRefs } from "vue";
import { storeToRefs } from "pinia";
import CommentComponent from "@/components/Comment/CommentComponent.vue";
import AddCommentComponent from "@/components/Comment/AddCommentComponent.vue";
import EditPostComponent from "@/components/UserPost/EditPostComponent.vue";
// const {} = TailwindClasses
const props = defineProps<{
  post: Post,
  index: number
}>();
const propsCopy = { ...props };
const myLikeId = ref<number>();
const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const getFullName = (fname: string, lname: string): string => {
  return `${fname} ${lname}`;
};
const handleLike = async (postId: number, postLikes: Array<any>) => {
  const iLiked = checkLike(postLikes);
  if (iLiked) return removeLike(postId);
  return addLike(postId);

};
const addLike = async (postId: number) => {
  const params: AddPostLikeParams = {
    postId: postId,
    userId: thunderFeedStore.getUserId
  };
  const likeResponse = await thunderFeedStore.addPostLike(params);
  toastStore.showToast(likeResponse);
  myLikeId.value = likeResponse.id;
};
const removeLike = async (postId: number) => {
  const likeResponse = await thunderFeedStore.removeLike(myLikeId.value);
  if (likeResponse.id > 0) {
    propsCopy.post.likes = Object.entries(propsCopy.post.likes).filter(([key, value]) => {
      value.id != likeResponse.id;
    });
  }
  toastStore.showToast(likeResponse);
};
const pluralize = (word: string, count: number) => {
  switch (word) {
    case "like":
      return count == 1 ? "Like" : "Likes";
    case "comment":
      return count == 1 ? "Comment" : "Comments";
  }
};
const checkLike = (likes: Array<any>) => {
  const count = likes.filter(like => like.user.id == thunderFeedStore.getUserId);
  if (count.length == 0) return false;
  myLikeId.value = count[0].id;
  return true;
};
const addComment = ref(false);
const addNewCommentToProps = (comments) => {
  propsCopy.post.comments = comments;
  addComment.value = false;
};

const actionsVisible = ref(false);
const handleMouseEnter = () => {
  if (thunderFeedStore.getUserId != propsCopy.post.user.id) return actionsVisible.value = false;
  return actionsVisible.value = true;

};
const handleDeletePost = async () => {
  if (!confirm("Are you sure you want to delete this Post?")) return;
  const deleteResponse = await thunderFeedStore.deletePost(propsCopy.post.id);
  toastStore.showToast(deleteResponse);
};
const handleCommentDelete = (commentId: number) => {
  console.log(propsCopy.post.comments);
  propsCopy.post.comments = propsCopy.post.comments
    .filter(comment => comment.id != commentId);
};
const isEditActive = ref(false);
const handleEditInput = (newBody: string) => {
  propsCopy.post.body = newBody;
  isEditActive.value = false;
};
</script>

<template>
  <li :class="TailwindClasses.POST_ELEMENT_STYLE" @mouseenter="handleMouseEnter()" @mouseleave="actionsVisible = false">
    <div class="flex relative">
      <Transition name="bounce-in">
        <div class="absolute right-0 top-0 flex" v-if="actionsVisible">
          <font-awesome-icon icon="edit" class="text-amber-800 hover:text-amber-500 transition ml-2 text-lg"
                             @click="isEditActive = true"></font-awesome-icon>
          <font-awesome-icon icon="circle-minus" class="text-red-500 hover:rotate-180 transition ml-2 text-lg"
                             @click="handleDeletePost()"></font-awesome-icon>
        </div>

      </Transition>
      <RouterLink to="/">
        <div :class="TailwindClasses.IMAGE_DIV_STYLE"></div>
      </RouterLink>
      <div :class="TailwindClasses.POST_CONTENT_STYLE">
        <RouterLink to="/" class="font-semibold text-amber-900">
          {{ getFullName(propsCopy.post.user.firstName, propsCopy.post.user.lastName) }}
        </RouterLink>
        <TransitionGroup name="slide-in" tag="div" class="w-full">
          <EditPostComponent :post-id="propsCopy.post.id" :body="propsCopy.post.body" v-if="isEditActive"
                             @postEdited="handleEditInput($event)" @focusout="isEditActive = false" />
          <p class="font-semibold text-amber-900 text-lg" v-else>{{ propsCopy.post.body }}</p>
        </TransitionGroup>


        <div class="flex justify-between">
          <div>{{ propsCopy.post.likes.length }} {{ pluralize("like", propsCopy.post.likes.length) }}</div>
          <div>{{ propsCopy.post.comments.length }} {{ pluralize("comment", propsCopy.post.likes.length) }}</div>
        </div>
        <div :class="TailwindClasses.ACTIONS_STYLE">
          <button :class="TailwindClasses.ACTION_BUTTON_STYLE"
                  @click="handleLike(propsCopy.post.id, propsCopy.post.likes)">
            <font-awesome-icon icon="thumbs-up" class="mr-2 transition-transform duration-500"
                               :class="{'rotate-180':checkLike(propsCopy.post.likes)} " />
            Like
          </button>
          <button :class="TailwindClasses.ACTION_BUTTON_STYLE" @click="addComment = !addComment">
            <font-awesome-icon icon="comment" class="mr-2" />
            Comment
          </button>
        </div>
        <!--        COmments-->
        <TransitionGroup name="list" v-if="propsCopy.post.comments.length > 0" tag="ul" appear>
          <CommentComponent v-for="(comment, index) in propsCopy.post.comments" :key="comment.body" :comment="comment"
                            :index="index" @deletedComment="handleCommentDelete($event)" />
        </TransitionGroup>
        <!--      COmmentsENd-->
      </div>

      <!--      AddComment-->
    </div>
    <Transition name="bounce-in">
      <AddCommentComponent v-if="addComment" @commentAdded="addNewCommentToProps($event)"
                           :post-id="propsCopy.post.id" />
    </Transition>
    <!--      AddComment End-->

  </li>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-out;
}

.fade-enter-from,
.fade-enter-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.bounce-in-enter-active,
.bounce-in-leave-active {
  transition: all 0.5s ease;
}

.bounce-in-enter-from,
.bounce-in-leave-to {
  opacity: 0;
  transform: scale(1.2);
}
</style>
