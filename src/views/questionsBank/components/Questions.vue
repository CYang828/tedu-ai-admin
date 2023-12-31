<template>
  <div class="question-container">
    <el-row class="search-form">
      <el-col :span="18">
        <el-form :inline="true" :model="searchForm" class="left-form-inline" label-position="left" label-width="120"
          label-suffix="：">
          <el-form-item label="编号">
            <el-input v-model="searchForm.questionId" placeholder="请输入编号" clearable size="middle" />
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="searchForm.kws" placeholder="请输入关键字" clearable size="middle" />
          </el-form-item>
          <el-form-item label="题目类型">
            <el-select v-model="searchForm.types" placeholder="请选择题目类型" clearable size="middle">
              <el-option label="选项1" value="选项1" />
              <el-option label="选项2" value="选项2" />
            </el-select>
          </el-form-item>
          <el-form-item label="题目难度">
            <el-select v-model="searchForm.difficulty" placeholder="请选择题目难度" clearable size="middle">
              <el-option label="选项1" value="选项1" />
              <el-option label="选项2" value="选项2" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.statuses" placeholder="请选择题目状态" clearable size="middle">
              <el-option label="选项1" value="选项1" />
              <el-option label="选项2" value="选项2" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6" class="right-action">
        <div>
          <el-button type="success" size="large">导出题库</el-button>
          <el-button v-if="$route.path == '/AI-Generate'" type="primary" size="large">生成题目</el-button>
        </div>
        <div>
          <el-button size="large">重置</el-button>
          <el-button type="primary" size="large">搜索</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="question-content">
      <exercises @updateList="updateListFn"></exercises>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import questionsBankApi from "@/utils/http/questionBank.serve.js";
import exercises from "@/components/exercises/index.vue"
const emits = defineEmits(['updateList']);
const searchForm = reactive({
  // 习题编号，关键字，类型，难度，状态
  questionId: null,
  kws: "",
  types: "",
  difficulty: "",
  statuses: "",
  //   分页页码，页数
  current: 1,
  size: 10

});

const onSubmit = () => {
  console.log("submit!");
};
const updateListFn = ()=>{
  emits('updateList')
}
</script>

<style lang="scss" scoped>
.question-container {
  background: #fff;
  height: 100%;
  box-sizing: border-box;
  padding: 2rem;
  overflow: auto;
  .search-form {
    margin-bottom:1rem;
    .left-form-inline {
      .el-select {
        width: 220px;
      }
      .el-input {
        --el-input-width: 220px;
      }
    }
    .right-action {
      text-align: right;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: end;
      div:last-child {
        margin-bottom:18px;
      }
      button {
        width:100px;
        margin-left:10px;
      }
    }
  }
}
</style>