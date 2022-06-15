<script setup lang="ts">
import { useThunderFeedStore } from "@/stores/thunderfeed";
import { useToastStore } from "@/stores/Toast";
import { onMounted } from "vue";
import PostComponent from "@/components/UserPost/PostComponent.vue";
import AddPostComponent from "@/components/UserPost/AddPostComponent.vue";
import { useRoute } from "vue-router";
import Index from "@/components/UserPost/Index.vue";
const thunderFeedStore = useThunderFeedStore();
const toastStore = useToastStore();
const route = useRoute();
const userId = route.params.id.toString();
onMounted(async () => {
  const response = await thunderFeedStore.getUserPosts(userId);
  toastStore.showToast(response);
});
</script>

<template>
  <section class="flex flex-col items-center w-full ">
    <div class="w-full bg-amber-900 absolute z-40 top-0 flex" style="height:400px">
        <div class="profilePicDiv border-4 border-white rounded-full absolute left-6 bottom-6">

        </div>
      <div class="nameDiv">

      </div>

    </div>
    <nav style="margin-top: 300px;" class="w-10/12 lg:w-7/12">
      <ul class="flex justify-center mt-2 mb-4">
        <li class="flex-1 py-2 text-center"><RouterLink :to="`/profile/${userId}/posts`">Posts</RouterLink></li>
        <li class="flex-1 py-2 text-center"><RouterLink :to="`/profile/${userId}/images`">Images</RouterLink></li>
        <li class="flex-1 py-2 text-center"><RouterLink :to="`/profile/${userId}/userdata`">User Data</RouterLink></li>
        <li class="flex-1 py-2 text-center" v-if="thunderFeedStore.getUserId === userId"><RouterLink :to="`/profile/${userId}/settings`">Settings</RouterLink></li>
      </ul>
    </nav>
    <Index :user-to="userId" />
  </section>
</template>

<style scoped>
.profilePicDiv{
  width: 200px;
  height: 200px;

}
.profilePicDiv Img {
  width: 100%;
  height: 100%;
}
.router-link-exact-active {
  border-bottom: 2px solid white;
  color: blue;

}
</style>