import { createRouter,createWebHashHistory } from "vue-router";
// 路由表
const routes = [];
// 创建路由对象
const router = createRouter({
    history:createWebHashHistory,
    routes
});
// 路由导航守卫
router.beforeEach((to,from,next)=>{
    // 登录及token处理
    return next()
});

export default router