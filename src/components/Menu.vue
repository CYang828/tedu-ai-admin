<template>
  <el-row class="tac" justify="space-between" align="middle">
    <el-col :span="24">
     
      <el-menu
        :default-active="activePath"
        class="el-menu-vertical-demo"
        active-text-color="#409EFF"
        router
        @open="handleOpen"
        @close="handleClose"
        :default-openeds="['1']"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Files /></el-icon>
            <span>题库管理</span>
          </template>
         
          <el-menu-item index="/Teaching">
            <el-icon><List /></el-icon>
          <span>教学题库</span>
        </el-menu-item>
        <el-menu-item index="/AI-Generate">
            <el-icon><List /></el-icon>
          <span>AI生成题库</span>
        </el-menu-item>
        </el-sub-menu>
       
      </el-menu>
    </el-col>
   
  </el-row>
</template>

<script setup>
import { ref,reactive, watch } from "vue"
import { useRoute} from "vue-router"
const route = useRoute()
let activePath = route.path

watch(route, (value, oldValue) => {
    console.log(value, oldValue)
    activePath = value.path
  })


const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
</script>




<style lang="scss" scoped>
</style>