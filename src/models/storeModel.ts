export interface ThunderStore {
  userLoggedIn: boolean,
  userToken: string,
  urls: Urls,
  auth: Auth
  posts: Post[],
  userData: any
}
export interface Post {
  id: number,
  body: string,
  user: User
  likes?: any
  comments?: any,
  createdAt: string,
  updatedAt: string
}
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  createdAt: string
  userPosts: Post[]
  gender: string
}
export interface Auth {
  isAuthOpen: boolean,
  isLoginActive: boolean,
  isRegisterActive: boolean,
}

export interface Urls {
    BASE: string,
    AUTH: AuthUrls,
    POST: CrudUrls,
    COMMENT: CrudUrls,
    LIKE: LikeUrls,
}

interface AuthUrls {
  LOGIN: string,
  REGISTER: string,
}

interface CrudUrls {
  GET_ALL: string,
  GET: string,
  ADD: string,
  UPDATE: string,
  DELETE: string
}
interface LikeUrls {
    ADD_POST: string,
    ADD_COMMENT: string,
    DELETE: string
}