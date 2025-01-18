import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

export const routes = [
  {
    path: "/login",
    component: () => import("@/views/Login/index"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/workbench",
  },
  {
    path: "/workbench",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/Workbench/index"),
        meta: { title: "工作台", icon: "el-icon-data-board" },
      },
    ],
  },
  {
    path: "/member",
    component: Layout,
    permission: "member",
    meta: { title: "会员区域", icon: "el-icon-user" },
    children: [
      {
        path: "manage",
        permission: "park:manage",
        meta: { title: "会员管理" },
        component: () => import("@/views/Member/Manage/index"),
      },
      {
        path: "order",
        permission: "park:order",
        meta: { title: "预约课程" },
        component: () => import("@/views/Member/Order/index"),
      },
    ],
  },

  {
    path: "/employee",
    component: Layout,
    permission: "employee",
    meta: { title: "员工区域", icon: "el-icon-suitcase" },
    children: [
      {
        path: "manage",
        permission: "parking:manage",
        component: () => import("@/views/Employee/Manage"),
        meta: { title: "员工管理" },
      },
      {
        path: "coach",
        permission: "parking:coach",
        component: () => import("@/views/Employee/Coach"),
        meta: { title: "私教管理" },
      },
    ],
  },
  {
    path: "/show",
    component: Layout,
    permission: "show",
    meta: { title: "活动区域 ", icon: "el-icon-shopping-bag-1" },
    children: [
      {
        path: "event",
        permission: "pole:event",
        component: () => import("@/views/Show/Event"),
        meta: { title: "活动发布" },
      },
      {
        path: "shop",
        permission: "pole:shop",
        component: () => import("@/views/Show/Shop"),
        meta: { title: "分店管理" },
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    mode: "history",
    scrollBehavior: () => ({ y: 0 }),
    routes: routes,
  });

const router = createRouter();

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter();
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher;
}

export default router;
