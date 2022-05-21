<script setup lang="ts">
import type { Post } from "@/models/storeModel";
import TailwindClasses from "@/utilities/TailwindClasses";
import { useThunderFeedStore } from "@/stores/thunderfeed";
import type { AddPostLikeParams } from "@/models/HelperModels";
import { useToastStore } from "@/stores/Toast";
import { ref, toRefs } from "vue";
import { storeToRefs } from "pinia";
import CommentComponent from "@/components/Comment/CommentComponent.vue";
// const {} = TailwindClasses
const props = defineProps<{
  post: Post,
  index: number
}>();
const propsCopy = {...props}
const myLikeId = ref<number>();
const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const getFullName = (fname: string, lname: string): string => {
  return `${fname} ${lname}`;
};
const handleLike = async (postId: number, postLikes: Array<any>,) => {
  const iLiked = checkLike(postLikes);
  if (iLiked) return removeLike(postId, postLikes, props.index);
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
const removeLike = async (postId: number, postLikes: Array<any>, index: number) => {
  const likeResponse = await thunderFeedStore.removeLike(myLikeId.value);
  if (likeResponse.id > 0) {
    const newPostData = await thunderFeedStore.getPost(postId);
    console.log(newPostData)
    thunderFeedStore.$patch(state => {
      thunderFeedStore.posts[index] = newPostData;
      console.log(thunderFeedStore.posts[index])
    });
    propsCopy.post.likes = newPostData.likes
  }
  toastStore.showToast(likeResponse);
};
const pluralize = (count: number) => {
  if (count == 1) return "Like";
  return "Likes";
};
const checkLike = (likes: Array<any>) => {
  const count = likes.filter(like => like.user.id == thunderFeedStore.getUserId);
  if (count.length == 0) return false;
  myLikeId.value = count[0].id;
  return true;
};
</script>

<template>
  <div :class="TailwindClasses.POST_ELEMENT_STYLE">
    <div>
      <RouterLink to="/">
        <div :class="TailwindClasses.IMAGE_DIV_STYLE"></div>
      </RouterLink>
      <div :class="TailwindClasses.POST_CONTENT_STYLE">
        <RouterLink to="/" class="font-semibold text-amber-900">
          {{ getFullName(propsCopy.post.user.firstName, propsCopy.post.user.lastName) }}
        </RouterLink>
        <p class="text-amber-900">{{ propsCopy.post.body }}</p>



        <div>
          <div>{{ propsCopy.post.likes.length }} {{ pluralize(propsCopy.post.likes.length) }}</div>
        </div>
        <div :class="TailwindClasses.ACTIONS_STYLE">
          <button :class="TailwindClasses.ACTION_BUTTON_STYLE" @click="handleLike(propsCopy.post.id, propsCopy.post.likes, index)">
            <font-awesome-icon icon="thumbs-up" class="mr-2 transition-transform duration-500" :class="{'rotate-180':checkLike(propsCopy.post.likes)} " />
            Like
          </button>
          <button :class="TailwindClasses.ACTION_BUTTON_STYLE">
            <font-awesome-icon icon="comment" class="mr-2" />
            Comment
          </button>
        </div>
        <!--        COmments-->
          <TransitionGroup class="comments" name="fade" duration="300">
            <CommentComponent v-for="comment in propsCopy.post.comments" :key="comment.id" :comment="comment" />
          </TransitionGroup>
        <!--      COmmentsENd-->
      </div>

  <!--      AddComment-->
    </div>
    <Transition >
      <div class="flex ">
        <div :class="TailwindClasses.COMMENT_IMAGE_DIV_STYLE"></div>
        <form @submit.prevent="" class="relative w-11/12">
          <input type="text" class="w-full rounded-full " :class="TailwindClasses.INPUT_STYLE" style="margin-bottom: 0;">
          <div class="absolute flex right-1 -inset-y-1/2">
            <label for="" class=" cursor-pointer flex items-center justify-center">
              <font-awesome-icon icon="file-image" :class="TailwindClasses.ADD_POST_BUTTONS_STYLE" class="p-2" />
              <input type="file" name="" id="" class="hidden" @change="onFileChange($event.target.files)" >

            </label>
            <div class=" flex items-center justify-center">
              <button type="submit" class="w-full flex items-center justify-center" >
                <font-awesome-icon icon="comment-dots" :class="TailwindClasses.ADD_POST_BUTTONS_STYLE"/></button>
            </div>

          </div>
        </form>


      </div>

    </Transition>
  <!--      AddComment End-->

  </div>
</template>

<style scoped>

</style>
