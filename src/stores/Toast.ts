import { acceptHMRUpdate, defineStore } from "pinia";
import type { ToastModel, ToastStoreModel } from "@/models/HelperModels";
import { useThunderFeedStore } from "@/stores/thunderfeed";

export const useToastStore = defineStore({
  id: "Toast",
  state: () =>
    ({
      isActive: false,
      message: "",
      type: "",
      Themes: [
        {
          Type: "Success",
          Icon: "circle-check",
          Color: "bg-green-500",
        },
        {
          Type: "Error",
          Icon: "circle-exclamation",
          Color: "bg-red-900",
        },
      ],
    } as ToastStoreModel),
  getters: {
    activeTheme: (state) =>
      state.Themes.filter((theme) => theme.Type == state.type)[0],
  },
  actions: {
    showToast(data: ToastModel) {
      this.$patch((state) => {
        state.isActive = true;
        state.message = data.message;
        state.type = data.type;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToastStore, import.meta.hot));
}
