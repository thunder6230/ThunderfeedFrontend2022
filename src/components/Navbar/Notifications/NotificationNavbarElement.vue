<script setup lang="ts">
import tailwindClasses from "@/utilities/TailwindClasses";
import type { Notification } from "@/models/storeModel";
import { defineAsyncComponent, onMounted, ref } from "vue";
const { COMMENT_IMAGE_DIV_STYLE } = tailwindClasses;
const props = defineProps<{
  notification: Notification;
}>();
const propsCopy = { ...props };
const getFullName = (fname: string, lname: string): string => {
  return `${fname} ${lname}`;
};
const NotificationTypes = {
  LIKE_COMMENT: "LikeCommentComponent",
  LIKE_USERPOST: "LikeUserpostComponent",
  LIKE_REPLY: "LikeReplyComponent",
  LIKE_PICTURE: "LikePictureComponent",
  FRIEND_REQUEST: "FriendRequestComponent",
};
const checkNotificationType = () => {
  const type = propsCopy.notification.type;
  for (const [key, value] of Object.entries(NotificationTypes)) {
    if (type == key) return value;
  }
};
const element = ref<{ element: string; elementId: number }>();
const name = getFullName(
  propsCopy.notification.userFrom.firstName,
  propsCopy.notification.userFrom.lastName
);
const returnElementId = () => {
  const idArr = ["userPostId", "commentId", "replyId"];
  idArr.forEach((name) => {
    if (name in propsCopy.notification !== null) {
      const id:number = propsCopy.notification[name];
      if(id != null)  element.value = { element: name, elementId: id }
    }
  });
};
onMounted(() => returnElementId())
</script>
<template>
  <li
    class="bg-amber-50 w-full text-amber-900 p-2 hover:bg-amber-300 transition border-amber-200 border-b-2"
  >
    <div class="flex">
      <RouterLink :to="`/profile/${propsCopy.notification.userFrom.id}`">
        <div class="imageDiv" :class="COMMENT_IMAGE_DIV_STYLE"></div>
      </RouterLink>
<!--      <Component
        class="flex flex-col"
        :is="
          defineAsyncComponent(() =>
            import(`./Components/${checkNotificationType()}.vue`)
          )
        "
        :name="name"
        :element="element"
      />-->
    </div>
  </li>
</template>

<style scoped></style>
