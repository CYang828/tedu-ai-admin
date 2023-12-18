<template>
  <div>
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container class="main-container">
        <el-aside width="240px">
          <SideMenu></SideMenu>
        </el-aside>
        <el-main>
          <div class="breadcrumb-container">
            <el-breadcrumb >
              <el-breadcrumb-item
                v-for="item in routers"
                :key="item.path"
                :to="{ path: item.path }"
              >
                {{ item.meta.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>

          <div class="main-content">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import SideMenu from "@/components/Menu.vue";
import Header from "@/components/Header.vue";
import { ref, reactive, watch, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

let breadList = reactive([]);
// 获取路由器实例
const router = useRouter();
console.log("router", router.currentRoute.value.matched);

// route响应式对象
const route = useRoute();

const routers = computed(() => {
  // 过滤掉没有meta的
  return router.currentRoute.value.matched.filter((item) => item.meta.title);
});
</script>

<style lang="scss" scoped>

</style>