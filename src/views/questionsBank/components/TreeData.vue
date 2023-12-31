<template>
  <div class="side-tree" :style="{width:!isCollapse ? '300px' : '35px'}">
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
            <template #append> <el-button icon="Search" /> </template
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select
            placeholder="请选择学科"
            size="large"
            v-model="searchSubject"
            @change="selectSubject"
          >
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 学科树展示 :default-expanded-keys="[1]" -->
      <el-tree
        ref="subjectTree"
        :props="treeProps"
        :load="loadNode"
        :node-key="id"
        lazy
        highlight-current
        class="subject-tree"
        @node-click="nodeClick"
        :default-expanded-keys="expendKeys"
      />
    </div>
  </div>
</template>
  
  <script  setup>
import { ref, reactive, onMounted,defineEmits } from "vue";
import questionsBankApi from "@/utils/http/questionBank.serve.js";
const emits = defineEmits(['treeNodeClick']);
const subjectTree = ref();
const treeProps = {
  label: "name",
  children: "subTopicList",
  subjectId: "subjectId",
  logoUrl: "logoUrl",
  subjectName: "subjectName",
  isLeaf: "leaf",
  id:"id"
};
let isCollapse = ref(false);
// 学科树列表
let list = reactive([]);
let expendKeys = reactive([]);
// 下拉菜单列表
let subjectList = ref([]);
// 下拉菜单绑定内容
let searchSubject = ref("");
let ids = ref([])
const selectSubject = (val) => {
  let node = subjectTree.value.getNode(val);
  //  设置未进行懒加载状态
  node.loaded = false;
  // 重新展开节点就会间接重新触发load达到刷新效果
  node.expand();
};

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
      item.leaf = false;
      item.id = item.subjectId
      return item;
    });

    console.log(list);

    return resolve(list);
  } else if (node.level === 1) {
    const res = await questionsBankApi.specialTopicsListLevel1({
      subjectId: node.data.subjectId,
    });

    return resolve(res);
  } else {
    const res = await questionsBankApi["specialTopicsListLevel" + node.level]({
      parentId: node.data.id,
    });
    if (node.level == 3) {
      res.every((item) => {
        return (item.leaf = true);
      });
    }
    return resolve(res);
  }
};
const nodeClick = (data) => {
  // console.log("被输出值{ data }的输出结果是：", data);
  let parentIds = findParentNodes(data)
  ids.value = [data.id].concat(parentIds)
  emits('treeNodeClick',ids.value)
};
const findParentNodes = (nodeData) => {
  const parentNodes = [];
  let treeref = subjectTree.value
 
  const findParent = (node) => {
    let pid = treeref.getNode(node).parent.data.id || 0;
    if (pid !== 0) {
      parentNodes.push(pid);
      findParent(treeref.getNode(node).parent.data);
    }
  };
  findParent(nodeData);
  return parentNodes;
}
</script>
  <style lang="scss"  scoped>
.side-tree {
  padding: 1rem 0;
  background-color: #fff;
  transition: width 0.2s ease-in-out;
  height: 100%;
  box-sizing: border-box;

  .side-content {
    overflow: auto;

    .el-form {
      margin-top: 1rem;
      padding-right: 1rem;
      .el-select {
        width: 100%;
      }
    }
    .subject-tree {
      overflow-y: auto;
      :deep(.el-tree-node) {
        padding-top: 1rem;
        margin-top: 0;
       
        :deep(.el-tree-node__children){
            margin-left:1rem;
          }
        
        ::deep(.el-tree-node__content) {
          padding-left: 36px;
          white-space: break-spaces;
          height: auto;
          padding-right: 5px;
          // line-height: 2;
        }
      }
    }
  }
}
</style>