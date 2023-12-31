<template>
  <el-dialog v-model="dialogVisibleCopy" title="试题目录调整" @close="close" width="30%">
    <!-- <el-form ref="form" label-width="0">
      <el-form-item label="">
        <el-input placeholder="请输入标签" size="large">
          <template #append> <el-button icon="Search" /> </template></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select placeholder="请选择学科" size="large" v-model="searchSubject" @change="selectSubject">
          <el-option v-for="item in subjectList" :key="item.subjectId" :label="item.subjectName"
            :value="item.subjectId"></el-option>
        </el-select>
      </el-form-item>
    </el-form> -->
    <div class="title">
      <span>题目标签：</span>
      <span>{{ ids[0] ? ids[0].name : name }}</span>
    </div>
    <el-tree ref="subjectTree" :props="treeProps" :load="loadNode" :node-key="id" lazy highlight-current
      class="subject-tree" @node-click="nodeClick" :default-expanded-keys="expendKeys" />

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibleCopy = false">取消</el-button>
        <el-button type="primary" @click="Confirm">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted,defineEmits } from "vue";
import questionsBankApi from "@/utils/http/questionBank.serve.js";
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  name:{
    type: String,
    default: ''
  }
})
const subjectTree = ref();
let isCollapse = ref(false);
// 学科树列表
let list = reactive([]);
let expendKeys = reactive([]);
// 下拉菜单列表
let subjectList = ref([]);
// 下拉菜单绑定内容
let searchSubject = ref("");
const treeProps = {
  label: "name",
  children: "subTopicList",
  subjectId: "subjectId",
  logoUrl: "logoUrl",
  subjectName: "subjectName",
  disabled:"disabled",
  isLeaf: "leaf",
  id: "id"
};
let ids = ref([])
const emits = defineEmits(["update:dialogVisible", "treeNodeClick"]);
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
      item.disabled = true
      return item;
    });

    console.log(list);

    return resolve(list);
  } else if (node.level === 1) {
    let res = await questionsBankApi.specialTopicsListLevel1({
      subjectId: node.data.subjectId,
    });
    res = res.map((item) => {
      return {
        ...item,
        disabled : true
      };
    });
    return resolve(res);
  } else {
    let res = await questionsBankApi["specialTopicsListLevel" + node.level]({
      parentId: node.data.id,
    });
    if(node.level == 2){
      res = res.map((item) => {
      return {
        ...item,
        disabled : true
      };
    });
    }
    if (node.level == 3) {
      res.every((item) => {
        return (item.leaf = true);
      });
    }
    return resolve(res);
  }
};
const nodeClick = (data,ceshi) => {
  if(data.disabled){
    ElMessage({
      message: '只能选择叶子结点',
      type: 'warning',
    })
    return
  }
  let parentIds = findParentNodes(ceshi)
  ids.value = [{ id: data.id, name: data.name }].concat(parentIds)
};
const selectSubject = (val) => {
 let node = subjectTree.value.getNode(val);
 //  设置未进行懒加载状态
 node.loaded = false;
//  // 重新展开节点就会间接重新触发load达到刷新效果
 node.expand();
};
const findParentNodes = (nodeData) => {
  const parentNodes = [];
  let treeref = subjectTree.value

  const findParent = (node) => {
    let pid = treeref.getNode(node).parent.data.id || 0;
    if (pid !== 0) {
      parentNodes.push({ id: pid, name: treeref.getNode(node).parent.data.name });
      findParent(treeref.getNode(node).parent.data);
    }
  };
  findParent(nodeData);
  return parentNodes;
}

const Confirm = () => {
  emits('treeNodeClick', ids.value)
  emits('update:dialogVisible', false)
}
const close = () => {
  emits('update:dialogVisible', false)
}
const dialogVisibleCopy = ref(props.dialogVisible)
</script>
<style lang="scss">
.el-dialog__body {
  height: 500px;
  overflow: auto;
  .title{
    font-size: 16px;
    margin-bottom: 20px;
  }
}
</style>