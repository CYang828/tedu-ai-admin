import { createRouter,  createWebHashHistory } from "vue-router";
// 路由表
export const routes = [

    {
        path: "/Teaching",
        name: "questionBank",
        meta: {
            title:"题库管理"
        },
        component: (resolve) => import("@/views/Home.vue", resolve),
        children: [
            {
                path: "",
                name: "Teaching",
                meta: {
                    title: "教学题库",
                },
                component: (resolve) =>
                    import("@/views/questionsBank/Teaching.vue",resolve ),
            },
            {
                path: "/AI-Generate",
                name: "AI-Generate",
                meta: {
                    title: "AI生成题库",
                },
                component: (resolve) =>
                    import("@/views/questionsBank/AI-Generate.vue", resolve),
            },
        ]
    },
    { path: '/', redirect: { path: '/Teaching' } },



];
// 创建路由对象 
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
// 路由导航守卫
router.beforeEach((to, from, next) => {
    // 登录及token处理

    // if (to.path == '/') {
    //     return next({ path: '/Teaching' })
    // } else { 
        return next()
    // }
   
});

export default router