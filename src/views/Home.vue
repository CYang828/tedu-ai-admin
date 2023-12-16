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
          <el-breadcrumb separator-icon="/">
            <template v-for="(item, index) in breadList">
              <el-breadcrumb-item
                v-if="item.name"
                :key="index"
                :to="item.path"
                >{{ item.meta.title }}</el-breadcrumb-item
              >
            </template>
          </el-breadcrumb>
          <div>
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
import { ref, reactive, watch,onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const breadList = reactive([]);
// 获取路由器实例
const router = useRouter();

// route响应式对象
const route = useRoute();

let getMatched = () => {
  console.log(route.matched);
  breadList.value = route.matched.filter(
    (item) => item.meta && item.meta.title
    );
    console.log("breadList",breadList);
};
onMounted(() => {
  getMatched();
});

watch(
  () => route.path,
  (newValue, oldValue) => {
    //监听路由路径是否发生变化，之后更改面包屑
    breadList.value = route.matched.filter(
      (item) => item.meta && item.meta.title
    );
  }
);
</script>

<style lang="scss" scoped>
</style>