import { createRouter, createWebHistory } from "vue-router";
import Posts from "../views/PostsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    {
      path: "/",
      name: "posts",
      component: Posts,
    },
    {
      path: "/posts/:id",
      name: "singlePost",
      component: () => import("../views/SinglePostView.vue"),
    },
    {
      path: "/profile/:id",
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
      children: [
        {
          path: "posts",
          component: () => import("../components/UserPost/Index.vue"),
        },
        {
          path: "userdata",
          component: () => import("../components/UserPost/Index.vue"),
        },
        {
          path: "images",
          component: () => import("../components/UserPost/Index.vue"),
        },
        {
          path: "settings",
          component: () => import("../components/UserPost/Index.vue"),
        },
      ],
    },
    {
      path: "/about",
      name: "about",

      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/future",
      name: "future",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/FuturePlans.vue"),
    },
    {
      path: "/friends",
      name: "friends",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/FriendsView.vue"),
    },
    {
      path: "/notifications/:id",
      name: "notifications",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/NotificationsView.vue"),
    },
  ],
});

export default router;
