<template>
  <el-row class="outer-row">

    <div class="left" style="">
      <Suspense>
        <left-tree @treeNodeClick="treeNodeClick"></left-tree>
      </Suspense>
    </div>
    <!-- </el-col>-->
    <div class="right">
      <!-- <Suspense> -->
      <div class="content-box">
        <QuestionsContent v-if="isShow" v-model:dataList="dataList" @updateList="updateListFn" ref="QuestionsContentRef"></QuestionsContent>
      </div>
      
      <div class="pageBox">
        <el-pagination
          v-model:current-page="pageObj.current"
          v-model:page-size="pageObj.size"
          :page-sizes="[10, 20, 30, 40]"
          :disabled="disabled"
          :background="background"
          layout="sizes, prev, pager, next"
          :total="pageObj.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
     
      <!-- </Suspense> -->
      <!-- </el-col> -->
    </div>
    <!-- </div> -->
  </el-row>
</template>

<script setup>
import { ref, provide, computed, watch } from "vue";
import "@/styles/questionsBank.scss";
import { defineAsyncComponent } from "vue";
import QuestionsContent from "./components/Questions.vue"
import questionsBankApi from "@/utils/http/questionBank.serve.js";
provide('dataList', computed(() => {
  return dataList.value
}))
const LeftTree = defineAsyncComponent(() =>
  import("./components/TreeData.vue")
);
const isShow = ref(true)
// const QuestionsContent = defineAsyncComponent(() => {
//   import("./components/Questions.vue");
// });
const paramsList = ref({
  current: 1,
  size: 10,
  subjectId: "", // 学科编号
  difficulty: "", // 习题难度
  kws: "", // 关键字
  questionId: "", // 习题编号
  source: "", // 习题来源
  st1Id: "", // 一级专题编号
  st2Id: "", // 二级专题编号
  st3Id: "", // 三级专题编号
  statuses: "", // 习题状态
  types: "", // 状态
})
const dataList = ref([
  // {
  //   "id": 1,
  //   "subjectId": 1,
  //   "name": "Java的基本数据类型有几种?",
  //   "type": 1,
  //   "answer": "",
  //   "parse": "Java共有八种基本数据类型，分别为byte、shot、int、long、float、double、char、boolean",
  //   "scoringRubric": "无",
  //   "difficulty": 1,
  //   "source": "TTS系统",
  //   "company": "IT学院",
  //   "st1id": 1,
  //   "st1name": "第一阶段",
  //   "st2id": 1,
  //   "st2name": "Java语言基础",
  //   "st3id": 2,
  //   "st3name": "数据类型",
  //   "createUserId": 1,
  //   "createUserName": "park",
  //   "createTime": 1702625496000,
  //   "updateUserId": 1,
  //   "updateUserName": "park",
  //   "updateTime": 1702625496000,
  //   "status": 0,
  //   "deleted": 0,
  //   "options": [
  //     {
  //       "id": 1,
  //       "questionId": 1,
  //       "key": null,
  //       "name": "6",
  //       "isAnswer": 0
  //     },
  //     {
  //       "id": 2,
  //       "questionId": 1,
  //       "key": null,
  //       "name": "7",
  //       "isAnswer": 0
  //     },
  //     {
  //       "id": 3,
  //       "questionId": 1,
  //       "key": null,
  //       "name": "8",
  //       "isAnswer": 1
  //     },
  //     {
  //       "id": 4,
  //       "questionId": 1,
  //       "key": null,
  //       "name": "9",
  //       "isAnswer": 0
  //     }
  //   ]
  // },
  // {
  //   "id": 5,
  //   "subjectId": 1,
  //   "name": "面向对象的三大特性是?",
  //   "type": 2,
  //   "answer": "",
  //   "parse": "",
  //   "scoringRubric": "无",
  //   "difficulty": 1,
  //   "source": "TTS系统",
  //   "company": "IT学院",
  //   "st1id": 1,
  //   "st1name": "第一阶段",
  //   "st2id": 2,
  //   "st2name": "Java面向对象编程",
  //   "st3id": 9999,
  //   "st3name": "未分类",
  //   "createUserId": 1,
  //   "createUserName": "park",
  //   "createTime": 1702625496000,
  //   "updateUserId": 1,
  //   "updateUserName": "park",
  //   "updateTime": 1702625496000,
  //   "status": 0,
  //   "deleted": 0,
  //   "options": [
  //     {
  //       "id": 5,
  //       "questionId": 5,
  //       "key": null,
  //       "name": "封装",
  //       "isAnswer": 1
  //     },
  //     {
  //       "id": 6,
  //       "questionId": 5,
  //       "key": null,
  //       "name": "继承",
  //       "isAnswer": 1
  //     },
  //     {
  //       "id": 7,
  //       "questionId": 5,
  //       "key": null,
  //       "name": "多态",
  //       "isAnswer": 1
  //     },
  //     {
  //       "id": 8,
  //       "questionId": 5,
  //       "key": null,
  //       "name": "抽象",
  //       "isAnswer": 0
  //     }
  //   ]
  // }
//   {
//   "id": 33,
//   "subjectId": 1,
//   "name": "Java中的基本数据类型有哪些?",
//   "type": 3,
//   "answer": "ava的基本数据类型有： 1、布尔型（boolean） 取值范围：True 或 False 2、字节型（byte） 取值范围：-128~127 3、短整型（short） 取值范围：-32,768 ~ 32767 4、整型（int） 取值范围：-2,147,483,648 ~ 2,147,483,647 5、长整型（long） 取值范围：-9223372036854775808~9223372036854775807 6、单精度浮点型（float） 负数范围: -3.402823E38 ~ -1.401298E-45 正数范围: 1.401298E-45 ~ 3.402823E38 7、双精度浮点型（double） 负数范围: -1.797,693,134,862,32E308 ~ -4.940,656,458,412,47E-324 正数范围: 4.940,656,458,412,47E-324 ~ 1.797,693,134,862,32E308 8、字符型（char） 取值范围：'\\u0000'~'\\ufff'",
//   "parse": "",
//   "scoringRubric": "无",
//   "difficulty": 1,
//   "source": "TTS系统",
//   "company": "IT学院",
//   "st1id": 1,
//   "st1name": "第一阶段",
//   "st2id": 1,
//   "st2name": "Java语言基础",
//   "st3id": 2,
//   "st3name": "数据类型",
//   "createUserId": 1,
//   "createUserName": "park",
//   "createTime": 1702625497000,
//   "updateUserId": 1,
//   "updateUserName": "park",
//   "updateTime": 1702625497000,
//   "status": 0,
//   "deleted": 0,
//   "options": []
// }

])
const pageObj = ref({
  total:0,
  size:10,
  current:1,
})
// 树点击
const treeNodeClick = async (ids) => {
  let idsreverse = ids.reverse()
  console.log(idsreverse, 'ids')
  paramsList.value.subjectId = idsreverse[0]
  paramsList.value.st1Id = idsreverse[1]
  paramsList.value.st2Id = idsreverse[2]
  paramsList.value.st3Id = idsreverse[3]
  paramsList.value.current = 1
  console.log(paramsList, 'paramsList')
  getPageList(paramsList)
}
// 请求列表
const getPageList = async (params) => {
  isShow.value = false
  const res = await questionsBankApi.questionsPageQuery(params.value);
  dataList.value = res.records
  pageObj.value = {
    total:res.total,
    size:res.size,
    current:res.current,
  }
  isShow.value = true
}
const handleSizeChange = (size)=>{
  console.log(size,'size')
  paramsList.value.current = 1
  paramsList.value.size = size
  getPageList(paramsList)
}
const handleCurrentChange = (current)=>{
  console.log(current,'current')
  paramsList.value.current = current
  getPageList(paramsList)
}
const updateListFn = ()=>{
  getPageList(paramsList)
}

</script>

<style lang="scss" scoped>
.content-box{
  height: calc(100% - 52px);
  background: #fff;
}
.pageBox{
  width: 100%;
  background: #fff;
  display: flex;
  padding-top: 20px;
  justify-content: center;
}
</style>