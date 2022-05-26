const theme = "amber";


 const tailwindClasses: TailwindClassesModel = {
  //Header
  HEADER_STYLE: `flex w-full justify-between items-center bg-amber-700 px-4 py-2 h-12 fixed top-0 z-50`,
  NAV_LINK_STYLE: `text-amber-50 font-semibold mr-2 px-1 border-b-2 border-amber-700 hover:border-amber-50 transition`,
  //POST
  IMAGE_DIV_STYLE: `mr-4 w-12 h-12 bg-amber-700 rounded-full`,
  POST_ELEMENT_STYLE: `flex flex-col bg-white w-10/12 lg:w-7/12 py-4 px-6 rounded-md mb-3 shadow-md shadow-amber-200`,
  POST_CONTENT_STYLE: `w-full`,
  ACTIONS_STYLE: `flex w-full justify-between border-t-2 border-amber-200 my-2`,
  ACTION_BUTTON_STYLE: `mt-2 flex items-center items-evenly w-3/6 justify-center font-semibold transition text-amber-700 hover:text-amber-500`,
  //ADDPOST
  ADD_POST_ELEMENT_STYLE: `relative bg-white w-10/12 lg:w-7/12 py-3 px-3 rounded-md mb-3 shadow-md shadow-amber-200 items-center`,
  ADD_POST_BUTTONS_STYLE: `text-amber-700 hover:text-amber-500 transition text-lg h-6 p-2`,
//COMMENT
  COMMENT_IMAGE_DIV_STYLE: `mr-4 w-10 h-10 bg-amber-700 rounded-full`,
   COMMENT_CONTENT_STYLE: `w-full rounded-md bg-amber-300 text-white px-2 pt-1 pb-2`,
   REPLY_CONTENT_STYLE: `w-full rounded-md bg-amber-100 text-white px-2 pt-1 pb-2`,
   COMMENT_ACTIONS_STYLE: `flex`,
   COMMENT_ACTION_BUTTON_STYLE: `font-semibold text-amber-900 hover:text-amber-700 transition mr-2 text-sm mt-1`,
  //AUTH MODAL
  INPUT_STYLE: `placeholder-amber-700 text-lg text-amber-500 focus:outline-none focus:border-amber-500 py-1 px-2 rounded-md border-amber-700 border-2 hover:border-amber-500 transition `,
  BUTTON_STYLE: `w-full bg-amber-50 rounded-md mb-1 font-semibold text-xl py-1 text-amber-700 hover:text-amber-50 hover:bg-amber-700 border-2 border-amber-700 transition`
};
export default tailwindClasses
export interface TailwindClassesModel {
  HEADER_STYLE: string,
  NAV_LINK_STYLE: string,
  IMAGE_DIV_STYLE: string,
  POST_ELEMENT_STYLE: string,
  POST_CONTENT_STYLE: string,
  ACTIONS_STYLE: string,
  ACTION_BUTTON_STYLE: string,
  INPUT_STYLE: string,
  BUTTON_STYLE: string,
  ADD_POST_ELEMENT_STYLE: string,
  ADD_POST_BUTTONS_STYLE: string,
  COMMENT_IMAGE_DIV_STYLE: string,
  COMMENT_CONTENT_STYLE: string,
  COMMENT_ACTIONS_STYLE: string,
  COMMENT_ACTION_BUTTON_STYLE:string,
  REPLY_CONTENT_STYLE: string
}


