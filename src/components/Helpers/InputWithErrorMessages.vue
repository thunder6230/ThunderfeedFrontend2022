<script setup lang="ts">
import TailwindClasses from "@/utilities/TailwindClasses";
import { ref } from "vue";
const emit = defineEmits(["newInput"]);
const props = defineProps<{
  value?: string;
  errors: Array<any>;
  placeholder: string;
  type?: string;
}>();
const inputText = ref("");
const propsCopy = { ...props };
const capitalizedName = (name: string) => {
  return `${name[0].toUpperCase()}${name.slice(1)}`;
};
const handleInput = () => {
  emit("newInput", inputText.value);
};

const nameErrorMessage = (message: string, name: string): string => {
  return message.replace("Value", capitalizedName(name));
};
</script>
<template>
  <div class="mb-2">
    <input
      :type="propsCopy.type || 'text'"
      :class="TailwindClasses.INPUT_STYLE"
      :placeholder="placeholder"
      v-model="inputText"
      @input="handleInput"
    />
    <TransitionGroup name="list" class="text-red-500 font-semibold" tag="ul">
      <li v-for="error in errors" :key="error.$uid">
        {{
          nameErrorMessage(
            error.$message.toString(),
            error.$property.toString()
          )
        }}
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped></style>
