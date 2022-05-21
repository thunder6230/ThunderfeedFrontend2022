import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";
import type { ThunderStore } from "@/models/storeModel";
import type { LoginModel, RegisterModel } from "@/models/AuthModels";
import type { AxiosError } from "axios";
import type { AddPostLikeParams, AddPostParams } from "@/models/HelperModels";

export const useThunderFeedStore = defineStore({
  id: "thunderfeed",
  state: () => ({
    userLoggedIn: false,
    userToken: "",
    userData: {},
    urls: {
      BASE: "https://localhost:7100",
      AUTH: {
        LOGIN: "/Auth/Login",
        REGISTER: "/Auth/Register"
      },
      POST: {
        GET_ALL: "/UserPost/getAll",
        GET: "/UserPost/getPost/",
        ADD: "/UserPost/AddPost",
        UPDATE: "/UserPost/UpdatePost",
        DELETE: "/UserPost/DeletePost"
      },
      COMMENT: {
        GET_ALL: "",
        GET: "",
        ADD: "",
        UPDATE: "",
        DELETE: ""
      },
      LIKE: {
        ADD_POST: "/Like/AddPost",
        ADD_COMMENT: "/Like/AddComment",
        DELETE: "/Like/Delete/"
      }
    },
    auth: {
      isAuthOpen: false,
      isLoginActive: false,
      isRegisterActive: false
    },
    posts: []
  }) as ThunderStore,
  getters: {
    getUserId: (state) => parseInt(state.userData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"])
  },
  actions: {
    // Auth Actions -- maybe separate in different store later
    async checkUserLoggedIn() {
      const userLoggedIn = sessionStorage.getItem("userLoggedIn");
      if (userLoggedIn == undefined) return;
      this.$patch(state => {
        state.userLoggedIn = true;
        state.userToken = userLoggedIn;
        state.userData = this.parseJwt(userLoggedIn);
        console.log(state.userData);
      });
    },
    async login(loginData: LoginModel) {
      return axios.post(this.urls.BASE + this.urls.AUTH.LOGIN, loginData)
        .then(resp => {
          this.$patch(state => {
            state.userLoggedIn = true;
            state.userToken = resp.data;
            state.userData = this.parseJwt(resp.data);
            sessionStorage.setItem("userLoggedIn", resp.data);
          });
          return { type: "Success", message: "Login Successful" };
        })
        .catch(error => {
          return { type: "Error", message: error.response.data };
        });
    },
    parseJwt(token: string) {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        return null;
      }
    },
    async register(registerData: RegisterModel) {
      return axios.post(this.urls.BASE + this.urls.AUTH.REGISTER, registerData)
        .then(resp => {
          return { type: "Success", message: resp.data };
        })
        .catch(error => {
          return { type: "Error", message: error.response.data };
        });
    },
    openAuthLogin() {
      this.$patch((state) => {
        state.auth.isAuthOpen = true;
        this.goToLogin();
      });
    },
    openAuthRegister() {
      this.$patch((state) => {
        state.auth.isAuthOpen = true;
        this.goToRegister();
      });
    },
    goToRegister() {
      this.$patch((state) => {
        state.auth.isLoginActive = false;
        state.auth.isRegisterActive = true;
      });
    },
    goToLogin() {
      this.$patch((state) => {
        state.auth.isRegisterActive = false;
        state.auth.isLoginActive = true;
      });
    },
    closeAuth() {
      this.$patch((state) => {
        state.auth.isAuthOpen = false;
        state.auth.isLoginActive = false;
        state.auth.isRegisterActive = false;
      });
    },
    getWeather() {
      axios.get(this.urls.BASE + "/WeatherForeCast", this.getAuthHeaderConfig()).then(resp => console.log(resp));
    },
    async logOut() {
      this.$patch(state => {
        state.userLoggedIn = false;
        state.userToken = "";
        sessionStorage.removeItem("userLoggedIn");
      });
      return { type: "Success", message: "Logout Successful" };
    },
    async getPosts() {
      return axios.get(this.urls.BASE + this.urls.POST.GET_ALL).then(resp => {
        console.log(resp.data);
        this.$patch(state => state.posts = resp.data);
        return { type: "Success", message: "Posts has been loaded" };
      }).catch(error => {
        return { type: "Error", message: "error.response.data" };
      });
    },
    async addPost(params: AddPostParams) {
      return axios.post(this.urls.BASE + this.urls.POST.ADD, params, this.getAuthHeaderConfig())
        .then(resp => {
          this.$patch(state => {
            state.posts.unshift(resp.data);
          });
          return { type: "Success", message: "Post has been successfully added" };
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "Error at adding post. Please try again" };
        });
    },
    getAuthHeaderConfig() {
      return { headers: { "Authorization": `bearer ${this.userToken}` } };
    },
    async addPostLike(params: AddPostLikeParams) {
      console.log(this.urls.BASE + this.urls.LIKE.ADD_POST);
      return axios.post(this.urls.BASE + this.urls.LIKE.ADD_POST, params, this.getAuthHeaderConfig())
        .then(resp => {
          this.$patch(state => {
            state.posts.filter(post => {
              if (post.id == params.postId) {
                post.likes.push(resp.data);
              }
            });
          });
          return { type: "Success", message: "Like has been successfully added" , id: resp.data.id};
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "Error like post. Please try again" };
        });
    },
    async getPost(id){
      return axios.get(this.urls.BASE + this.urls.POST.GET +  id).then(resp => resp.data)
    },
    async removeLike(likeId: number) {

      return axios.delete(this.urls.BASE + this.urls.LIKE.DELETE+ likeId, this.getAuthHeaderConfig())
        .then(resp => {
          return { type: "Success", message: "Like has been deleted", id:likeId };
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "Error at adding post. Please try again" };
        });

    }
  }
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThunderFeedStore, import.meta.hot));
}