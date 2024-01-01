<template>
  <el-dialog v-model="dialogVisibleCopy" title="生成试题" @close="close" width="50%" >
    <div class="content">
      <el-form :inline="true" :rules="rules"  ref="ruleFormRef" :model="formInline" class="demo-form-inline" size="medium"
      :label-position="labelPosition">
      <el-row >
        <el-col :span="7">
          <el-form-item label="题目类型" prop="type">
            <el-select v-model="formInline.type" placeholder="请选择">
              <el-option v-for="(item, key) in typeList" :key="parseInt(key)" :label="item" :value="parseInt(key)" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" style="margin-left: 20px;">
          <el-form-item label="题目难度" prop="difficulty">
            <el-select v-model="formInline.difficulty" placeholder="请选择">
              <el-option v-for="(item, key) in difficultyDit" :key="parseInt(key)" :label="item" :value="parseInt(key)" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" style="margin-left: 20px;">
          <el-form-item label="试题数量" prop="count">
            <el-input v-model="formInline.count" placeholder="请输入" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tree ref="subjectTree" :props="treeProps" :load="loadNode" :node-key="id" lazy highlight-current
      class="subject-tree" @node-click="nodeClick" :default-expanded-keys="expendKeys" />
    </div>
   
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibleCopy = false">取消</el-button>
        <el-button type="primary" @click="Confirm(ruleFormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted, defineEmits } from "vue";
import questionsBankApi from "@/utils/http/questionBank.serve.js";
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})
const formInline = ref({
  type: "",
  count: "",
  difficulty:""
})
const typeList = ref({
  1: '单选题',
  2: '多选题',
  3: '简答题',
})
const difficultyDit = ref({
  1:'简单',
  2:'中等',
  3:'困难',
})
const numberValidator = (rule, value, callback) => {
  if(/^[1-9]\d*$/.test(value)){
    callback()
  }else{
    callback(new Error('请输入合法的试题数量'))
  }
}
const rules = reactive({
  type: [
    { required: true, message: '请选择题目类型', trigger: 'blur' },
  ],
  difficulty: [
    { required: true, message: '请选择题目难度', trigger: 'blur' },
  ],
  count: [
    { validator: numberValidator,  trigger: 'blur' },
  ],
})
const ruleFormRef = ref()

const dialogVisibleCopy = ref(props.dialogVisible)
const subjectTree = ref();
let subjectList = ref([]);
let list = reactive([]);
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
let expendKeys = reactive([]);
let ids = ref([])
const emits = defineEmits(["update:dialogVisible"]);
const close = () => {
  emits('update:dialogVisible', false)
}

const Confirm = async (formEl) => {
  // emits('update:dialogVisible', false)
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if(ids.value.length > 0){
        let params = {
          ...formInline.value,
          subjectId: ids.value[0],
          st1Id: ids.value[1], // 一级专题编号
          st2Id: ids.value[2], // 二级专题编号
          st3Id: ids.value[3], // 三级专题编号
        }
        const res = await questionsBankApi.aiGenerate(params);
        emits('update:dialogVisible', false)
      }else{
        ElMessage({
          message: "请选择分类",
          type: 'warning',
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
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
      item.leaf = false;
      item.id = item.subjectId
      item.disabled = true
      return item;
    });

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
  // if(data.disabled){
  //   ElMessage({
  //     message: '只能选择叶子结点',
  //     type: 'warning',
  //   })
  //   return
  // }
  let parentIds = findParentNodes(ceshi)
  ids.value = [data.id].concat(parentIds)
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
<style scoped lang="scss">
.content{
  height: 500px;
  overflow: auto;
}
.el-form-item {
  width: 100%;

  .el-select {
    width: 100%;
  }
}

</style>