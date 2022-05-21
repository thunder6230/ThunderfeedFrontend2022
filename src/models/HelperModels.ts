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
export interface AddPostLikeParams {
  postId: number,
  userId: number,
}