import Vue from 'vue'
import VueRouter from 'vue-router'
import { getCookie } from "../utils/auth"
Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/mainNav'
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login")
  },
  {
    name: "register",
    path: "/register",
    component: () => import("@/views/login/register.vue")
  },
  {
    name: "header",
    path: "/mainNav",
    component: () => import("@/views/mainNav"),
    children: [
      {
        name: "mainNav",
        path: "/mainNav",
        component: () => import("@/views/home")
      },
      {
        name: "foodMaterial",
        path: "/mainNav/foodMaterial",
        component: () => import("@/views/foodMaterial")
      },
      {
        name: "foodMaterialDesc",
        path: "/mainNav/foodMaterialDesc",
        component: () => import("@/views/foodMaterialDesc")
      },
      {
        name: "recipe",
        path: "/mainNav/recipe",
        component: () => import("@/views/recipe")
      },
      {
        name: "addRecipe",
        path: "/mainNav/addRecipe",
        component: () => import("@/views/recipe/component/addRecipe")
      },
      {
        name: "recipeDesc",
        path: "/mainNav/recipeDesc",
        component: () => import("@/views/recipeDesc")
      },
      {
        name: "announcement",
        path: "/mainNav/announcement",
        component: () => import("@/views/announcement")
      },
      {
        name: "announcementDesc",
        path: "/mainNav/announcementDesc",
        component: () => import("@/views/announcementDesc")
      },
      {
        name: "forum",
        path: "/mainNav/forum",
        component: () => import("@/views/forum")
      },
      {
        name: "addForum",
        path: "/mainNav/addForum",
        component: () => import("@/views/forum/component/addForum")
      },
      {
        name: "forumDesc",
        path: "/mainNav/forumDesc",
        component: () => import("@/views/forumDesc")
      },
      {
        name: 'privateLetter',
        path: "/mainNav/privateLetter",
        component: () => import("@/views/privateLetter")
      },
      {
        name: "menu",
        path: "/mainNav/menu",
        component: () => import("@/views/menu"),
        children: [
          {
            name: 'systemFoodMaterial',
            path: "/mainNav/menu/systemFoodMaterial",
            component: () => import("@/views/system/systemFoodMaterial")
          },
          {
            name: 'systemRecipe',
            path: "/mainNav/menu/systemRecipe",
            component: () => import("@/views/system/systemRecipe")
          },
          {
            name: 'systemAudit',
            path: "/mainNav/menu/systemAudit",
            component: () => import("@/views/system/systemAudit")
          },
          {
            name: 'systemAuditDesc',
            path: "/mainNav/menu/systemAuditDesc",
            component: () => import("@/views/system/systemAuditDesc")
          },
          {
            name: 'systemAnnouncement',
            path: "/mainNav/menu/systemAnnouncement",
            component: () => import("@/views/system/systemAnnouncement")
          },
          {
            name: 'systemUser',
            path: "/mainNav/menu/systemUser",
            component: () => import("@/views/system/systemUser")
          },
        ]
      },
      {
        name: "peopleCenter",
        path: "/mainNav/peopleCenter",
        component: () => import("@/views/peopleCenter"),
        children: [
          {
            name: "personData",
            path: "/mainNav/peopleCenter/personData",
            component: () => import("@/views/peopleCenter/component/personData"),
          },
          {
            name: "myRecipe",
            path: "/mainNav/peopleCenter/myRecipe",
            component: () => import("@/views/peopleCenter/component/myRecipe"),
          },
          {
            name: "myCollect",
            path: "/mainNav/peopleCenter/myCollect",
            component: () => import("@/views/peopleCenter/component/myCollect"),
          },
          {
            name: "myConcern",
            path: "/mainNav/peopleCenter/myConcern",
            component: () => import("@/views/peopleCenter/component/myConcern"),
          },
          {
            name: "myFans ",
            path: "/mainNav/peopleCenter/myFans",
            component: () => import("@/views/peopleCenter/component/myFans"),
          },
          {
            name: "myFans ",
            path: "/mainNav/peopleCenter/editMyInfo",
            component: () => import("@/views/peopleCenter/component/editMyInfo"),
          },
        ]
      },
    ],
  },


]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  const token = getCookie()
  if (!token && !(to.path === '/login' || to.path === '/register')) {
    next({ path: '/login' })
  } else if (token && to.path === '/login') {
    next({ path: '/mainNav' })
  } else {
    next()
  }
})
export default router
