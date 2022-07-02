<script setup lang="ts">
import type { Notification } from "@/models/storeModel";
import getLikeTypes, {
  checkNotificationType,
  getFullName,
} from "@/components/Helpers/Functions";

const props = defineProps<{
  notification: Notification;
}>();
const propsCopy = { ...props };
const { firstName, lastName } = propsCopy.notification.userFrom;
const { type } = propsCopy.notification;
const name = getFullName(firstName, lastName);
const body = checkNotificationType(type);
const types = getLikeTypes();
</script>
<template>
  <RouterLink :to="`/Posts/${propsCopy.notification.postId}`">
    <div>
      <strong>{{ name }}</strong> {{ body }}
    </div>
    <div v-if="type === types.FRIEND_REQUEST">
      <FontAwesomeIcon icon="fa-user-plus" />
    </div>
  </RouterLink>
</template>

<style scoped></style>
