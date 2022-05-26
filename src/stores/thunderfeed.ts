import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";
import type { ThunderStore } from "@/models/storeModel";
import type { LoginModel, RegisterModel } from "@/models/AuthModels";
import type { AddCommentLikeParams, AddPostLikeParams, AddPostParams } from "@/models/HelperModels";

axios.defaults.baseURL = "https://localhost:7100";
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
        DELETE: "/UserPost/DeletePost/"
      },
      COMMENT: {
        GET_ALL: "",
        GET: "/Comment/Get/",
        ADD: "/Comment/Post/Add",
        UPDATE: "/Comment/Update",
        DELETE: "/Comment/Delete/"
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
      const userData = this.parseJwt(userLoggedIn);
      if (Date.now() >= userData.exp * 1000) return sessionStorage.removeItem("userLoggedIn");
      this.$patch(state => {
        state.userLoggedIn = true;
        state.userToken = userLoggedIn;
        state.userData = this.parseJwt(userLoggedIn);
        console.log(state.userData);
      });
    },
    async login(loginData: LoginModel) {
      return axios.post(this.urls.AUTH.LOGIN, loginData)
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
      return axios.post(this.urls.AUTH.REGISTER, registerData)
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
    async logOut() {
      this.$patch(state => {
        state.userLoggedIn = false;
        state.userToken = "";
        sessionStorage.removeItem("userLoggedIn");
      });
      return { type: "Success", message: "Logout Successful" };
    },
    async getPosts() {
      return axios.get(this.urls.POST.GET_ALL).then(resp => {
        console.log(resp.data);
        this.$patch(state => state.posts = resp.data);
        return { type: "Success", message: "Posts has been loaded" };
      }).catch(error => {
        return { type: "Error", message: "error.response.data" };
      });
    },
    async addPost(params: FormData) {
      return axios.post(this.urls.POST.ADD, params, this.getAuthHeaderConfigWithFileUpload())
        .then(resp => {
          this.$patch(state => {
            state.posts.unshift(resp.data);
          });
          return { type: "Success", message: "Post have been successfully added" };
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "Error at adding post. Please try again" };
        });
    },
    getAuthHeaderConfig() {
      return { headers: { "Authorization": `bearer ${this.userToken}` } };
    },
    getAuthHeaderConfigWithFileUpload() {
      return {
        headers: {
          "Authorization": `bearer ${this.userToken}`,
          "content-type": "multipart/form-data"
        }
      };
    },
    async addPostLike(params: AddPostLikeParams) {
      console.log(this.urls.LIKE.ADD_POST);
      return axios.post(this.urls.LIKE.ADD_POST, params, this.getAuthHeaderConfig())
        .then(resp => {
          this.$patch(state => {
            state.posts.filter(post => {
              if (post.id == params.postId) {
                post.likes.push(resp.data);
              }
            });
          });
          return { type: "Success", message: "Like has been successfully added", id: resp.data.id };
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "Error like post. Please try again" };
        });
    },
    async addCommentLike(params: AddCommentLikeParams) {
      return axios.post(this.urls.LIKE.ADD_COMMENT, params, this.getAuthHeaderConfig())
        .then(resp => {
          return { type: "Success", message: "Like has been successfully added", like: resp.data };
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "Error like post. Please try again" };
        });
    },
    async getPost(id: number) {
      return axios.get(this.urls.POST.GET + id).then(resp => resp.data);
    },
    async getComment(id: number) {
      return axios.get(this.urls.COMMENT.GET + id).then(resp => resp.data);
    },
    async removeLike(likeId: number) {

      return axios.delete(this.urls.LIKE.DELETE + likeId, this.getAuthHeaderConfig())
        .then(resp => {
          return { type: "Success", message: "Like has been deleted", id: likeId };
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "Error at deleting like. Please try again" };
        });

    },
    async addComment(params) {
      return axios.post(this.urls.COMMENT.ADD, params, this.getAuthHeaderConfig())
        .then(resp => {
          return { comment: resp.data, type: "Success", message: "Comment has been successfully added" };
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "Error at adding comment. Please try again" };
        });
    },
    async deletePost(postId: number) {
      return axios.delete(this.urls.POST.DELETE + postId, this.getAuthHeaderConfig())
        .then(resp => {
          this.posts = this.posts.filter(post => post.id != resp.data);
          {
            return { type: "Success", message: "Post has been successfully deleted" };
          }
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "Error at deleting Post. Please try again" };
        });
    },
    async deleteComment(commentId: number) {
      return axios.delete(this.urls.COMMENT.DELETE + commentId, this.getAuthHeaderConfig())
        .then(resp => {
          {
            return { id: resp.data, type: "Success", message: "Comment has been successfully deleted" };
          }
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "Error at deleting Post. Please try again" };
        });
    },
    async updateComment(props) {
      return axios.put(this.urls.COMMENT.UPDATE, props, this.getAuthHeaderConfig())
        .then(resp => {
          {
            return { newBody: resp.data, type: "Success", message: "Comment has been successfully edited" };
          }
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "Error at editing Comment. Please try again" };
        });
    },
    async updatePost(props) {
      return axios.put(this.urls.POST.UPDATE, props, this.getAuthHeaderConfig())
        .then(resp => {
          {
            return { newBody: resp.data, type: "Success", message: "Post has been successfully edited" };
          }
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "Error at editing Post. Please try again" };
        });
    }
  }
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThunderFeedStore, import.meta.hot));
}