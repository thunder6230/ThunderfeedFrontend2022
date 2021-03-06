import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";
import type { ThunderStore } from "@/models/storeModel";
import type { LoginModel, RegisterModel } from "@/models/AuthModels";
import type {
  AddCommentLikeParams,
  AddPostLikeParams,
  AddReplyParams,
  AddReplyLikeParams,
  EditCommentParams,
  EditPostparams,
  CRUDResponse,
  EditReplyParams,
} from "@/models/HelperModels";

axios.defaults.baseURL = "https://localhost:7100";
export const useThunderFeedStore = defineStore({
  id: "thunderfeed",
  state: () =>
    ({
      userLoggedIn: false,
      userToken: "",
      userData: {},
      URLS: {
        BASE: "https://localhost:7100",
        AUTH: {
          LOGIN: "/Auth/Login",
          REGISTER: "/Auth/Register",
        },
        POST: {
          GET_ALL: "/UserPost/getAll",
          GET_ALL_USER: "/UserPost/getUserPosts",
          GET: "/UserPost/getPost/",
          ADD: "/UserPost/AddPost",
          UPDATE: "/UserPost/UpdatePost",
          DELETE: "/UserPost/DeletePost/",
        },
        REPLY: {
          GET_ALL: "/Reply/getAll",
          GET: "/Reply/get/",
          ADD: "/Reply/Add",
          UPDATE: "/Reply/Update",
          DELETE: "/Reply/Delete/",
        },
        COMMENT: {
          GET_ALL: "",
          GET: "/Comment/Get/",
          ADD: "/Comment/Post/Add",
          UPDATE: "/Comment/Update",
          DELETE: "/Comment/Delete/",
          ADD_REPLY: "/Comment/Reply/Add",
        },
        LIKE: {
          ADD_POST: "/Like/AddPost",
          ADD_COMMENT: "/Like/AddComment",
          ADD_REPLY: "/Like/AddReply",
          DELETE: "/Like/Delete/",
        },
        NOTIFICATION: {
          GET_ALL: "/Notification/GetAll",
          GET_ALL_UNREAD: "/Notification/GetAllUnread",
          MARK_READ: "/Notification/MarkRead",
          DELETE: "/Notification/DELETE",
        },
      },
      auth: {
        isAuthOpen: false,
        isLoginActive: false,
        isRegisterActive: false,
      },
      notifications: [],
      posts: [],
      page: 1,
      count: 10,
    } as ThunderStore),
  getters: {
    getUserId: (state) =>
      parseInt(
        state.userData[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ]
      ),
  },
  actions: {
    // Auth Actions -- maybe separate in different store later
    async getUnreadNotifications() {
      if (!this.userLoggedIn) return;
      const response = await axios.get(
        this.URLS.NOTIFICATION.GET_ALL_UNREAD + `/${this.getUserId}`,
        this.getAuthHeaderConfig()
      );
      // if(response.status != 200)
      this.notifications = response.data;
      return { updated: true };
    },
    async checkUserLoggedIn() {
      const userLoggedIn = localStorage.getItem("userLoggedIn");
      if (userLoggedIn == undefined) return;
      const userData = this.parseJwt(userLoggedIn);
      if (Date.now() >= userData.exp * 1000)
        return localStorage.removeItem("userLoggedIn");
      this.$patch((state) => {
        state.userLoggedIn = true;
        state.userToken = userLoggedIn;
        state.userData = this.parseJwt(userLoggedIn);
      });
    },
    async login(loginData: LoginModel) {
      return axios
        .post(this.URLS.AUTH.LOGIN, loginData)
        .then((resp) => {
          this.$patch((state) => {
            state.userLoggedIn = true;
            state.userToken = resp.data;
            state.userData = this.parseJwt(resp.data);
            localStorage.setItem("userLoggedIn", resp.data);
          });
          this.getUnreadNotifications();
          return { type: "Success", message: "Login Successful" };
        })
        .catch((error) => {
          console.log(error);
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
    async register(registerData: RegisterModel): Promise<CRUDResponse> {
      return axios
        .post(this.URLS.AUTH.REGISTER, registerData)
        .then((resp) => {
          this.goToLogin();
          return { type: "Success", message: resp.data };
        })
        .catch((error) => {
          console.log(error);
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
      this.$patch((state) => {
        state.userLoggedIn = false;
        state.userToken = "";
        localStorage.removeItem("userLoggedIn");
      });
      return { type: "Success", message: "Logout Successful" };
    },
    async getPosts(): Promise<CRUDResponse> {
      const url = this.URLS.POST.GET_ALL;
      return axios
        .get(url)
        .then((resp) => {
          this.$patch((state) => (state.posts = resp.data));
          return { type: "Success", message: "Posts has been loaded" };
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "error.response.data" };
        });
    },
    async getMorePosts(id?: string): Promise<CRUDResponse> {
      const url =
        id === undefined
          ? this.URLS.POST.GET_ALL
          : `${this.URLS.POST.GET_ALL_USER}/${id}`;
      return axios
        .get(url)
        .then((resp) => {
          this.$patch((state) => state.posts.push(resp.data));
          return { type: "Success", message: "Posts has been loaded" };
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "error.response.data" };
        });
    },
    async getPost(id: string): Promise<CRUDResponse> {
      const url = this.URLS.POST.GET;
      return axios
        .get(url + id)
        .then((resp) => {
          return {
            type: "Success",
            message: `Post "${id}" has been loaded`,
            post: resp.data,
          };
        })
        .catch((error) => {
          console.log(error);
          return { type: "Error", message: "error.response.data" };
        });
    },
    async getUserPosts(userId: string): Promise<CRUDResponse> {
      const url = `${this.URLS.POST.GET_ALL_USER}/${userId}`;
      return axios
        .get(url)
        .then((resp) => {
          this.$patch((state) => (state.posts = resp.data));
          return { type: "Success", message: "Posts has been loaded" };
        })
        .catch(() => {
          return { type: "Error", message: "error.response.data" };
        });
    },
    async addPost(params: FormData): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .post(
          this.URLS.POST.ADD,
          params,
          this.getAuthHeaderConfigWithFileUpload()
        )
        .then((resp) => {
          this.$patch((state) => {
            state.posts.unshift(resp.data);
          });
          return {
            type: "Success",
            message: "Post have been successfully added",
          };
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error at adding post. Please try again",
          };
        });
    },
    getAuthHeaderConfig() {
      return { headers: { Authorization: `bearer ${this.userToken}` } };
    },
    getAuthHeaderConfigWithFileUpload() {
      return {
        headers: {
          Authorization: `bearer ${this.userToken}`,
          "content-type": "multipart/form-data",
        },
      };
    },
    async addPostLike(params: AddPostLikeParams): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .post(this.URLS.LIKE.ADD_POST, params, this.getAuthHeaderConfig())
        .then((resp) => {
          this.$patch((state) => {
            state.posts.filter((post) => {
              if (post.id == params.postId) {
                post.likes.push(resp.data);
              }
            });
          });
          return {
            type: "Success",
            message: "Like has been successfully added",
            id: resp.data.id,
          };
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error like post. Please try again",
          };
        });
    },
    async addCommentLike(
      params: AddCommentLikeParams
    ): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .post(this.URLS.LIKE.ADD_COMMENT, params, this.getAuthHeaderConfig())
        .then((resp) => {
          return {
            type: "Success",
            message: "Like has been successfully added",
            like: resp.data,
          };
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error like post. Please try again",
          };
        });
    },
    // async getPost(id: string) {
    //   return axios.get(this.URLS.POST.GET + id).then((resp) => resp.data);
    // },
    async getComment(id: number) {
      return axios.get(this.URLS.COMMENT.GET + id).then((resp) => resp.data);
    },
    async removeLike(likeId: number): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .delete(this.URLS.LIKE.DELETE + likeId, this.getAuthHeaderConfig())
        .then(() => {
          return {
            type: "Success",
            message: "Like has been deleted",
            id: likeId,
          };
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error at deleting like. Please try again",
          };
        });
    },
    async addComment(params: FormData): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .post(
          this.URLS.COMMENT.ADD,
          params,
          this.getAuthHeaderConfigWithFileUpload()
        )
        .then((resp) => {
          return {
            comment: resp.data,
            type: "Success",
            message: "Comment has been successfully added",
          };
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error at adding comment. Please try again",
          };
        });
    },
    async deletePost(postId: number): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .delete(this.URLS.POST.DELETE + postId, this.getAuthHeaderConfig())
        .then((resp) => {
          this.posts = this.posts.filter((post) => post.id != resp.data);
          {
            return {
              type: "Success",
              message: "Post has been successfully deleted",
            };
          }
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error at deleting Post. Please try again",
          };
        });
    },
    async deleteComment(commentId: number): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .delete(
          this.URLS.COMMENT.DELETE + commentId,
          this.getAuthHeaderConfig()
        )
        .then((resp) => {
          {
            return {
              id: resp.data,
              type: "Success",
              message: "Comment has been successfully deleted",
            };
          }
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error at deleting Post. Please try again",
          };
        });
    },
    async updateComment(
      props: EditCommentParams
    ): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .put(this.URLS.COMMENT.UPDATE, props, this.getAuthHeaderConfig())
        .then((resp) => {
          {
            return {
              newBody: resp.data,
              type: "Success",
              message: "Comment has been successfully edited",
            };
          }
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error at editing Comment. Please try again",
          };
        });
    },
    async updatePost(props: EditPostparams): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .put(this.URLS.POST.UPDATE, props, this.getAuthHeaderConfig())
        .then((resp) => {
          {
            return {
              newBody: resp.data,
              type: "Success",
              message: "Post has been successfully edited",
            };
          }
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error at editing Post. Please try again",
          };
        });
    },
    async addReply(params: AddReplyParams): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .post(this.URLS.REPLY.ADD, params, this.getAuthHeaderConfig())
        .then((resp) => {
          return {
            reply: resp.data,
            type: "Success",
            message: "Reply has been successfully added",
          };
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error at adding reply. Please try again",
          };
        });
    },
    async deleteReply(replyId: number): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .delete(this.URLS.REPLY.DELETE + replyId, this.getAuthHeaderConfig())
        .then((resp) => {
          {
            return {
              id: resp.data,
              type: "Success",
              message: "Reply has been successfully deleted",
            };
          }
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error at deleting Reply. Please try again",
          };
        });
    },
    async addReplyLike(
      params: AddReplyLikeParams
    ): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .post(this.URLS.LIKE.ADD_REPLY, params, this.getAuthHeaderConfig())
        .then((resp) => {
          return {
            type: "Success",
            message: "Like has been successfully added",
            like: resp.data,
          };
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error like post. Please try again",
          };
        });
    },
    async updateReply(props: EditReplyParams): Promise<void | CRUDResponse> {
      if (!this.userLoggedIn) return this.openAuthLogin();
      return axios
        .put(this.URLS.REPLY.UPDATE, props, this.getAuthHeaderConfig())
        .then((resp) => {
          {
            return {
              newBody: resp.data,
              type: "Success",
              message: "Reply has been successfully edited",
            };
          }
        })
        .catch((error) => {
          console.log(error);
          return {
            type: "Error",
            message: "Error at editing Reply. Please try again",
          };
        });
    },
  },
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThunderFeedStore, import.meta.hot));
}
