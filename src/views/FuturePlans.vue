<script lang="ts" setup>
import { reactive } from "vue";

const plans = reactive<Detail[]>([
  {
    name: "Image Gallery",
    icon: "images",
    details: [
      "Fullscreen Image Gallery",
      "Like Comment and Reply the Images Separate From the Post",
      "All Posts will have a Different Gallery Instance",
    ],
  },
  {
    name: "Real Time Chat",
    icon: "comments",
    details: [
      "Floating Window at the bottom",
      "FriendList",
      "Inactive Chat Grouping to save place",
      "Emojis",
    ],
  },
  {
    name: "Profile Settings",
    icon: "sliders",
    details: [
      "Privacy Setting",
      "Profile Picture",
      "Global Themes saved to Account",
    ],
  },
  {
    name: "Add/Remove Friends",
    icon: "user-group",
    details: ["Pending Requests", "User Recommendations", "Privacy settings"],
  },
  {
    name: "Profile Datas",
    icon: "address-card",
    details: ["Hobbies", "Education", "User Datas", "Top of the Profile Page"],
  },
  {
    name: "Weather Forecast App",
    icon: "cloud-sun",
    details: [
      "Default Location Based",
      "Widget Style",
      "Today With 3 Hour Blocks",
      "Next 3 Days",
    ],
  },
]);

interface Detail {
  name: string;
  icon: string;
  details: string[];
}
</script>
<template>
  <section class="flex flex-col items-center justify-center w-full">
    <h1 class="my-2 font-semibold text-lg">
      This is a list about the bigger changes i plan
    </h1>
    <ul>
      <li v-for="plan in plans" :key="plan.name">
        <div class="flex items-center items-center">
          <div class="iconDiv">
            <font-awesome-icon :icon="plan.icon" class="icon" />
          </div>
          <div>
            <h1 class="mb-8 font-semibold text-4xl">{{ plan.name }}</h1>
            <ul class="pl-4">
              <li v-for="det in plan.details" :key="det" class="my-1 text-lg">
                <font-awesome-icon icon="circle-check" class="mr-2" />
                {{ det }}
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.iconDiv {
  width: 300px;
  height: 300px;
  padding: 80px;
}

.icon {
  width: 100%;
  height: 100%;
}
</style>
