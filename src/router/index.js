import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

export const routes = [
  {
    path: "/member/add",
    meta: { title: "添加会员" },
    component: () => import("@/views/Member/Manage/addMember.vue"),
    hidden: true,
  },
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
    path: "/clock",
    component: Layout,
    permission: "clock",
    meta: { title: "考勤区域", icon: "el-icon-pie-chart" },
    children: [
      {
        path: "signin",
        permission: "park:signin",
        meta: { title: "会员签到" },
        component: () => import("@/views/Clock/SignIn"),
      },
      {
        path: "clockin",
        permission: "park:clockin",
        meta: { title: "员工打卡" },
        component: () => import("@/views/Clock/ClockIn"),
      },
      {
        path: "leave",
        permission: "park:leave",
        meta: { title: "申请请假" },
        component: () => import("@/views/Clock/Leave"),
      },
      {
        path: "overtime",
        permission: "park:overtime",
        meta: { title: "申请加班" },
        component: () => import("@/views/Clock/Overtime"),
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

// 设置全局前置守卫
router.beforeEach((to, from, next) => {
  // 可以在这里进行路由守卫的逻辑处理
  // 例如：身份验证、权限校验、加载数据等
  // console.log(to, from);
  if (to.path === "/login") {
    if (store.state.user.token) {
      next(from.path);
    } else {
      next();
    }
  } else if (to.path === "/404") {
    next();
  } else {
    if (!store.state.user.token) {
      next("/login");
    } else {
      next();
    }
  }
  // 确保要调用next()来resolve这个钩子
  next();
});

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter();
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher;
}

export default router;
