<script setup lang="ts">
import type { Like, Post } from "@/models/storeModel";
import TailwindClasses from "@/utilities/TailwindClasses";
import { useThunderFeedStore } from "@/stores/thunderfeed";
import type { AddPostLikeParams } from "@/models/HelperModels";
import { useToastStore } from "@/stores/Toast";
import { onMounted, ref } from "vue";
import type { Comment } from "@/models/storeModel";
import CommentComponent from "@/components/Comment/CommentComponent.vue";
import AddCommentComponent from "@/components/Comment/AddCommentComponent.vue";
import EditPostComponent from "@/components/UserPost/EditPostComponent.vue";
const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();

const props = defineProps<{
  post?: Post;
  index?: number;
  singlePost?: {
    isSingle: boolean;
    id: string;
  };
}>();

const propsCopy = { ...props };

const myLikeId = ref<number>();
const getFullName = (fname: string, lname: string): string => {
  return `${fname} ${lname}`;
};
const handleLike = async (postId: number, postLikes: Array<Like>) => {
  const iLiked = checkLike(postLikes);
  if (iLiked) return removeLike();
  return addLike(postId);
};
const addLike = async (postId: number) => {
  const params: AddPostLikeParams = {
    postId: postId,
    userId: thunderFeedStore.getUserId,
  };
  const response = await thunderFeedStore.addPostLike(params);
  if (response == undefined) return;
  toastStore.showToast(response);
  myLikeId.value = response.id;
};
const removeLike = async () => {
  if (myLikeId.value == null) return;
  const response = await thunderFeedStore.removeLike(myLikeId.value);
  if (response == undefined) return;
  if (response.id && propsCopy.post != undefined) {
    propsCopy.post.likes = Object.values(propsCopy.post.likes).filter(
      (like: Like) => like.id != response.id
    );
  }
  toastStore.showToast(response);
};
const pluralize = (word: string, count: number) => {
  switch (word) {
    case "like":
      return count == 1 ? "Like" : "Likes";
    case "comment":
      return count == 1 ? "Comment" : "Comments";
  }
};
const checkLike = (likes: Array<Like>) => {
  if (thunderFeedStore.getUserId == null) return false;
  const count = likes.filter(
    (like) => like.userId == thunderFeedStore.getUserId
  );
  if (count.length == 0) return false;
  myLikeId.value = count[0].id;
  return true;
};
const addComment = ref(false);
const addNewCommentToProps = (comment: Comment) => {
  if (propsCopy.post != undefined) {
    propsCopy.post.comments.push(comment);
    addComment.value = false;
  }
};

const actionsVisible = ref(false);
const handleMouseEnter = () => {
  if (propsCopy.post) {
    const { id } = propsCopy.post.user;
    if (thunderFeedStore.getUserId != id) return (actionsVisible.value = false);
    return (actionsVisible.value = true);
  }
};
const handleDeletePost = async () => {
  if (!confirm("Are you sure you want to delete this Post?")) return;
  if (propsCopy.post) {
    const response = await thunderFeedStore.deletePost(propsCopy.post.id);
    if (response == undefined) return;
    toastStore.showToast(response);
  }
};
const handleCommentDelete = (commentId: number) => {
  if (propsCopy.post) {
    propsCopy.post.comments = propsCopy.post.comments.filter(
      (comment: Comment) => comment.id != commentId
    );
  }
};
const isEditActive = ref(false);
const handleEditInput = (newBody: string) => {
  if (propsCopy.post) {
    propsCopy.post.body = newBody;
    isEditActive.value = false;
  }
};
onMounted(async () => {
  if (propsCopy.singlePost?.isSingle === true) {
    const { id } = propsCopy.singlePost;
    const response = await thunderFeedStore.getPost(id);
    propsCopy.post = response.post;
    toastStore.showToast(response);
  }
});
</script>

<template>
  <li
    :class="TailwindClasses.POST_ELEMENT_STYLE"
    @mouseenter="handleMouseEnter()"
    @mouseleave="actionsVisible = false"
  >
    <div class="flex relative">
      <Transition name="bounce-in">
        <div class="absolute right-0 top-0 flex" v-if="actionsVisible">
          <font-awesome-icon
            icon="edit"
            class="text-amber-800 hover:text-amber-500 transition ml-2 text-lg cursor-pointer"
            @click="isEditActive = true"
          ></font-awesome-icon>
          <font-awesome-icon
            icon="circle-minus"
            class="text-red-500 hover:rotate-180 transition ml-2 text-lg cursor-pointer"
            @click="handleDeletePost()"
          ></font-awesome-icon>
        </div>
      </Transition>
      <RouterLink :to="`/profile/${propsCopy.post.user.id}/posts`">
        <div :class="TailwindClasses.IMAGE_DIV_STYLE"></div>
      </RouterLink>
      <div :class="TailwindClasses.POST_CONTENT_STYLE">
        <RouterLink
          :to="`/profile/${propsCopy.post.user.id}/posts`"
          class="font-semibold text-amber-900"
        >
          {{
            getFullName(
              propsCopy.post.user.firstName,
              propsCopy.post.user.lastName
            )
          }}
        </RouterLink>
        {{ propsCopy.post.userTo != null ? `to` : "" }}
        <RouterLink
          v-if="propsCopy.post.userTo != null"
          :to="`/profile/${propsCopy.post.userTo.id}/posts`"
          class="font-semibold text-amber-900"
        >
          {{
            getFullName(
              propsCopy.post.userTo.firstName,
              propsCopy.post.userTo.lastName
            )
          }}
        </RouterLink>
        <TransitionGroup name="slide-in" tag="div" class="w-full">
          <EditPostComponent
            :post-id="propsCopy.post.id"
            :body="propsCopy.post.body"
            v-if="isEditActive"
            @postEdited="handleEditInput($event)"
            @focusout="isEditActive = false"
          />
          <p class="font-semibold text-amber-900 text-lg" v-else>
            {{ propsCopy.post.body }}
          </p>
        </TransitionGroup>
        <TransitionGroup
          name="slide-in"
          tag="div"
          v-if="propsCopy.post.pictures.length > 0"
          class="flex flex-wrap"
        >
          <img
            v-for="(picture, index) in propsCopy.post.pictures"
            :key="picture.fileName"
            :src="`${thunderFeedStore.URLS.BASE}/${picture.imgPath}`"
            class="w-full object-cover lg:w-3/6 p-2 shadow"
            style="max-height: 300px"
            :alt="`Picture ${index + 1}`"
          />
        </TransitionGroup>

        <div class="flex justify-between">
          <div>
            {{ propsCopy.post.likes.length }}
            {{ pluralize("like", propsCopy.post.likes.length) }}
          </div>
          <div>
            {{ propsCopy.post.comments.length }}
            {{ pluralize("comment", propsCopy.post.likes.length) }}
          </div>
        </div>
        <div :class="TailwindClasses.ACTIONS_STYLE">
          <button
            :class="TailwindClasses.ACTION_BUTTON_STYLE"
            @click="handleLike(propsCopy.post.id, propsCopy.post.likes)"
          >
            <font-awesome-icon
              icon="thumbs-up"
              class="mr-2 transition-transform duration-500"
              :class="{ 'rotate-180': checkLike(propsCopy.post.likes) }"
            />
            Like
          </button>
          <button
            :class="TailwindClasses.ACTION_BUTTON_STYLE"
            @click="addComment = !addComment"
          >
            <font-awesome-icon icon="comment" class="mr-2" />
            Comment
          </button>
        </div>
        <!--        COmments-->
        <TransitionGroup
          name="list"
          v-if="propsCopy.post.comments.length > 0"
          tag="ul"
          appear
        >
          <CommentComponent
            v-for="(comment, index) in propsCopy.post.comments"
            :key="comment.body"
            :comment="comment"
            :index="index"
            @deletedComment="handleCommentDelete($event)"
          />
        </TransitionGroup>
        <!--      COmmentsENd-->
      </div>

      <!--      AddComment-->
    </div>
    <Transition name="bounce-in">
      <AddCommentComponent
        v-if="addComment"
        @commentAdded="addNewCommentToProps($event)"
        :post-id="propsCopy.post.id"
      />
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
</style>
