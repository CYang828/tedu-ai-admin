<template>
  <el-row class="outer-row">
    <div class="left" style="">
      <Suspense>
        <left-tree></left-tree>
      </Suspense>
    </div>
    <!-- </el-col>-->
    <div class="right">
      <!-- <Suspense> -->
      <QuestionsContent></QuestionsContent>
      <!-- </Suspense> -->
      <!-- </el-col> -->
    </div>
    <!-- </div> -->
  </el-row>
</template>

<script setup>
import "@/styles/questionsBank.scss";
import { defineAsyncComponent } from "vue";
import QuestionsContent from "./components/Questions.vue";
const LeftTree = defineAsyncComponent(() =>
  import("./components/TreeData.vue")
);
</script>

<style lang="scss" scoped>
</style>