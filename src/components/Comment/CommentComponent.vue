<template>
  <div class="flex mb-2">
    <RouterLink to="/">
      <div :class="TailwindClasses.COMMENT_IMAGE_DIV_STYLE"></div>
    </RouterLink>
    <div :class="TailwindClasses.COMMENT_CONTENT_STYLE">
      <RouterLink to="/" class="font-semibold text-amber-900 m-0 text-sm">
        {{ getFullName(propsCopy.post.user.firstName, propsCopy.post.user.lastName) }}
      </RouterLink>
      <p class="font-semibold text-white text-lg leading-3">{{ propsCopy.post.body }}</p>
      <div :class="TailwindClasses.COMMENT_ACTIONS_STYLE">
        <button :class="TailwindClasses.COMMENT_ACTION_BUTTON_STYLE">Like</button>
        <button :class="TailwindClasses.COMMENT_ACTION_BUTTON_STYLE">Comment</button>
        <button :class="TailwindClasses.COMMENT_ACTION_BUTTON_STYLE" >Edit</button>
        <button :class="TailwindClasses.COMMENT_ACTION_BUTTON_STYLE">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentComponent"
};
</script>

<style scoped>

</style>