export interface ToastStoreModel{
  isActive: boolean,
  message: string,
  type: string,
  Themes: Array<ThemeModel>
}

export interface ToastModel{
  type: string,
  message: string
}
export interface ThemeModel {
  Type: string,
  Icon: string,
  Color: string
}
export interface AddPostParams {
  userId: number,
  body: string,
  file: string | null
}
export interface AddCommentParams {
  userId: number,
  postId: number,
  body: string,
  file: string | null
}
export interface EditCommentParams {
  userId: number,
  commentId: number,
  body: string,
  file: string | null
}
export interface EditPostparams {
  userId: number,
  postId: number,
  body: string,
  file: string | null
}
export interface AddPostLikeParams {
  postId: number,
  userId: number,
}
export interface AddCommentLikeParams {
  commentId: number,
  userId: number,
}