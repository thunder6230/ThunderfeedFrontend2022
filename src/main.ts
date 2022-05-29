import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import "./index.css";

const axiosInstance = axios.create({
  withCredentials: true,
});

import FontAwesomeIcon from "@/utilities/fontawsome";

const app = createApp(App);
app.config.globalProperties.$axios = { ...axiosInstance };
/* add font awesome icon component */
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());
app.use(router);

app.mount("#app");
