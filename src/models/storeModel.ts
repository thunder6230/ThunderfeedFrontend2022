export interface ThunderStore {
  userLoggedIn: boolean;
  userToken: string;
  URLS: Urls;
  auth: Auth;
  posts: Post[];
  userData: any;
  notifications: Notification[];
}

export interface Post {
  id: number;
  body: string;
  user: User;
  userTo: User;
  likes: Like[];
  comments: Comment[];
  pictures: Picture[];
  createdAt: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}
export interface Picture {
  id: number;
  imgpath: string;
  postId?: number;
  commentId?: number;
}
export interface Comment {
  id: number;
  userId: number;
  postId: number;
  body: string;
  replies: Reply[];
}
export interface Reply {
  id: number;
  userId: number;
  commentId: number;
  body: string;
}
export interface Like {
  id: number;
  userId: number;
  postId?: number;
  commentId?: number;
  replyId?: number;
}
export interface Notification {
  id: number;
  userFrom: User;
  postId?: number;
  commentId?: number;
  replyId?: number;
  isUnread: boolean;
  type: string;
}

export interface Auth {
  isAuthOpen: boolean;
  isLoginActive: boolean;
  isRegisterActive: boolean;
}

export interface Urls {
  BASE: string;
  AUTH: AuthUrls;
  POST: PostUrls;
  COMMENT: CommentUrls;
  LIKE: LikeUrls;
  REPLY: CrudUrls;
  NOTIFICATION: NotificationsUrls;
}

interface AuthUrls {
  LOGIN: string;
  REGISTER: string;
}

interface CrudUrls {
  GET_ALL: string;
  GET: string;
  ADD: string;
  UPDATE: string;
  DELETE: string;
}

interface PostUrls {
  GET_ALL: string;
  GET_ALL_USER: string;
  GET: string;
  ADD: string;
  UPDATE: string;
  DELETE: string;
}

interface CommentUrls {
  GET_ALL: string;
  GET: string;
  ADD: string;
  UPDATE: string;
  DELETE: string;
  ADD_REPLY: string;
}

interface LikeUrls {
  ADD_POST: string;
  ADD_COMMENT: string;
  DELETE: string;
  ADD_REPLY: string;
}
interface NotificationsUrls {
  GET_ALL: string;
  GET_ALL_UNREAD: string;
  DELETE: string;
  MARK_READ: string;
}
