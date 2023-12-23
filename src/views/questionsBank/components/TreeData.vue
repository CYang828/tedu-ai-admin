<template>
  <div class="side-tree">
    <table></table>
    <el-icon @click="isCollapse = !isCollapse" size="20">
      <Fold v-if="isCollapse" />
      <Expand v-else />
    </el-icon>

    <div v-show="!isCollapse" class="side-content">
      <!-- 顶部搜索 :model="form"-->
      <el-form ref="form" label-width="0">
        <el-form-item label="">
          <el-input placeholder="请输入标签" size="large">
            <template #append>
              <el-button icon="Search" /> </template
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select placeholder="请选择学科" size="large" v-model="searchSubject" @change="selectSubject">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 学科树展示 -->
      <el-tree
        :props="treeProps"
        :load="loadNode"
        node-key="id"
        lazy
        highlight-current
        class="subject-tree"
      />
    </div>
  </div>
</template>
  
  <script  setup>
import { ref } from "vue";
import questionsBankApi from "@/utils/http/questionBank.serve.js";

const treeProps = {
  label: "name",
  children: "subTopicList",
  subjectId: "subjectId",
  logoUrl: "logoUrl",
  subjectName: "subjectName",
  isLeaf: "leaf",
};
let isCollapse = ref(false);
// 学科树列表
let list = ref([]);
// 下拉菜单列表
let subjectList = ref([]);
// 下拉菜单绑定内容
let searchSubject = ref("")
  const selectSubject = (val) => { 
    console.log(val,list)
  }

const loadNode = async (node, resolve) => {
  // 根节点
  if (node.level === 0) {
    const res = await questionsBankApi.subjectsList();
    if (!subjectList.length) {
      subjectList = res.data;
    }
    list = res.data.map((item) => {
      item.label = item.subjectName;
      item.children = [];
      item.name = item.subjectName;
      return item;
    });
    console.log(list);

    return resolve(list);
  } else if (node.level === 1) {
    // 叶子节点
    const res = await questionsBankApi.specialTopicsList({
      subjectId: node.id,
    });
    console.log(res);

    return resolve(res[0].subTopicList);
  } else {
    console.log(node);
    resolve(node.data.subTopicList ? node.data.subTopicList : []);
  }
};
</script>
  <style lang="scss"  scoped>
.side-tree {
  padding-top: 1rem;
  .side-content {
    width: 30%;
    max-width: 300px;
    height: 100%;
    .el-form {
      margin-top: 1rem;
      padding-right: 1rem;
      .el-select {
        width: 100%;
      }
    }
    .subject-tree {
      overflow-y: auto;
      :deep .el-tree-node {
        margin: 1rem 0;
        margin-top: 0;
        .el-tree-node__content {
          padding-left: 36px;
          white-space: break-spaces;
          height: auto;
          padding-right: 5px;
          line-height: 2;
        }
      }
    }
  }
}
</style>