<script lang="ts" setup>
import { reactive } from "vue";
</script>
<template>
  <section class="flex flex-col items-center justify-center w-full">
    <h1 class="my-2 font-semibold text-lg">
     Manage Notifications
    </h1>
    <TransitionGroup>
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
    </TransitionGroup>
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
