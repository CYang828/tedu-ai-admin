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
           
            <div>
               
                <el-breadcrumb separator-icon="/">
           
              <el-breadcrumb-item
              v-for="item in breadList"
                :key="item.path"
               
                >{{ item.meta.title }}</el-breadcrumb-item
              >
          
          </el-breadcrumb>
            </div>
         
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
import { nextTick } from "process";

let breadList = ref([]);
// 获取路由器实例
const router = useRouter();

// route响应式对象
const route = useRoute();

let getMatched = () => {
    console.log("route.matched", route.matched);
 
//   breadList = route.matched.filter(
//     (item) => item.meta && item.meta.title
    //     );
    // nextTick(() => { 
        breadList = route.matched
    // })

    
    console.log("-matched",route.matched.filter(
    (item) => item.meta && item.meta.title
    ));
};
onMounted(() => {
    getMatched();
  console.log(breadList,route.matched)
});

watch(
  () => route,
  (newValue, oldValue) => {
    //监听路由路径是否发生变化，之后更改面包屑
    // breadList = route.matched.filter(
    //   (item) => item.meta && item.meta.title
      //   );
      nextTick(() => { 
          breadList = newValue.matched;
      })
    // breadList = route.matched
    console.log(breadList)
  }
);
</script>

<style lang="scss" scoped>
</style>