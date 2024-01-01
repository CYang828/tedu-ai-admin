<template>
  <div class="shortAnswerZHM"  @dblclick="handleDoubleClick(dataListItem)">
    <div class="title-box">
      <div class="title">简答题：</div>
      <div class="name-box" v-show="!isEdit">
        {{ dataListItem.name }}
      </div>
      <div class="name-box" v-show="isEdit">
        <el-input
          v-model="dataListItem.name"
          :autosize="{ minRows: 1, maxRows: 6 }"
          placeholder="请输入"
          show-word-limit
          type="textarea"
        />
      </div>
      <div class="switch-box">
        <el-switch @change="changeSwitch" v-model="dataListItem.status" size="large" style="--el-switch-off-color: #ff4949" :active-value="1"
          :inactive-value="0" :inactive-text="dataListItem.status === 0 ? '禁用：' : '启用：'" />
      </div>
      <div class="btn-box">
        <el-button type="primary" @click="saveFn(dataListItem)" v-show="isEdit">保存</el-button>
        <el-button type="danger" @click="delFn(dataListItem)">删除</el-button>
      </div>
    </div>
    <div class="info-box">
      <div>
        <span class="title">试题难度：</span>
        <span v-show="!isEdit">{{ difficultyDit[dataListItem.difficulty] }}</span>
        <el-select v-show="isEdit" v-model="dataListItem.difficulty" class="m-2" placeholder="Select">
          <el-option
            v-for="(item,key) in difficultyDit"
            :key="parseInt(key)"
            :label="item"
            :value="parseInt(key)"
          />
        </el-select>
      </div>
      <div>
        <span>试题类型：</span>
        <span>{{ dataListItem.company }}</span>
      </div>
      <div>
        <span>试题来源：</span>
        <span>{{ dataListItem.source }}</span>
      </div>
      
     
    </div>
    <div class="options-box">
      <div class="answer" v-show="!isEdit">
        {{dataListItem.answer}}
      </div>
      <el-input
        v-show="isEdit"
        v-model="dataListItem.answer"
        :autosize="{ minRows: 1, maxRows: 6 }"
        placeholder="请输入"
        show-word-limit
        type="textarea"
      />
    </div>
    <div class="info-bottom">
      <div class="parse">
        <div style="min-width: 70px;">评分细则：</div>
        <el-tooltip
          
          effect="dark"
          :content="dataListItem.parse"
          placement="top-start"
        >
          <span v-show="!isEdit">
            {{ dataListItem.parse }}
          </span>
          
        </el-tooltip>
        <el-input
          v-show="isEdit"
          v-model="dataListItem.parse"
          placeholder="请输入"
        />

      </div>
      <div class="time-box">
        <span class="title">修改时间：</span>
        <span class="time-value">{{ that.proxy.$myUtils.transferDate(dataListItem.updateTime) }}</span>
      </div>
      <div>
        <span class="title">修改人：</span>
        <span class="name-value">{{ dataListItem.updateUserName }}</span>
      </div>
      <div>
        <span class="title">试题标签：</span>
        <span v-show="!isEdit" class="name-value">{{ dataListItem.st3name }}</span>
        <el-button style="height: 24x;margin-top: 5px;" v-show="isEdit" @click="openTreeModel">{{ dataListItem.st3name }}</el-button>

      </div>
      <div>
        <span class="title">试题编号：</span>
        <span class="name-value">{{ dataListItem.id }}</span>
      </div>
    </div>
    <treeModel v-model:dialogVisible="dialogVisible" @treeNodeClick="treeNodeClick" :name="dataListItem.st3name" v-if="dialogVisible"></treeModel>
  </div>
</template>
<script setup>
import { ref ,getCurrentInstance, onMounted } from "vue";
import questionsBankApi from "@/utils/http/questionBank.serve.js";
import treeModel from "@/components/exercises/treeModel.vue"
const that = getCurrentInstance()
const props = defineProps({
  // 列表数据
  dataList: {
    type: Array,
    default: () => []
  },
  dataListItem: {
    type: Object,
    default: () => {}
  }
})
const isEdit = ref(false)
const dialogVisible = ref(false)
const emits = defineEmits(['update:dataListItem','updateList']);
const difficultyDit = ref({
  1:'简单',
  2:'中等',
  3:'困难',
})

// 状态开关
const changeSwitch = async (value)=>{
  let data = {
    id: props.dataListItem.id,
    status: value
  }
  const res = await questionsBankApi.updateStateExercise(data);
}

const delFn = function (dataListItem) {
  ElMessageBox.confirm(
    '确认删除吗？',
    '删除试题',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async() => {
    const res = await questionsBankApi.deleteExercise({
      id:dataListItem.id
    });
    emits('updateList')
  }).catch(() => {

  })
}
// 修改保存
const saveFn = async (dataListItem)=>{
  let answerIndex = []
  dataListItem.options.forEach((item,idx)=>{
    answerIndex.push(idx)
  })
  let data = {
    // answerIndex:JSON.stringify(answerIndex), //答案索引
    deleted:0,
    // options:JSON.stringify(dataListItem.options),
    type:dataListItem.type,
    answer:dataListItem.answer,
    company:dataListItem.company,
    difficulty:dataListItem.difficulty,
    id:dataListItem.id,
    name:dataListItem.name,
    parse:dataListItem.parse,
    scoringRubric:dataListItem.scoringRubric,
    source:dataListItem.source,
    st1id:dataListItem.st1id,
    st2id:dataListItem.st2id,
    st3id:dataListItem.st3id,
    status:dataListItem.status,
    subjectId:dataListItem.subjectId,
  }
  const res = await questionsBankApi.updateExercise(data);
  isEdit.value = false
  emits('updateList')
}
const handleDoubleClick = (dataListItem)=>{
  isEdit.value = true
}
const getLetterFromNumber = (num)=>{
  const baseCharCode = 'A'.charCodeAt(0); // 获取字符 'A' 的编码值
  // 进行运算，得到对应的字符
  const letter = String.fromCharCode(baseCharCode + num);
  return letter;
}


// 打开树弹窗
const openTreeModel = ()=>{
  dialogVisible.value = true
}
// 弹窗点击确定
const treeNodeClick = (ids)=>{
  let dataListItemCopy = JSON.parse(JSON.stringify(props.dataListItem))
  let idsreverse = ids.reverse()
  dataListItemCopy.subjectId = idsreverse[0].id
  dataListItemCopy.st1id = idsreverse[1].id
  dataListItemCopy.st1name = idsreverse[1].name
  dataListItemCopy.st2id = idsreverse[2].id
  dataListItemCopy.st2name = idsreverse[2].name
  dataListItemCopy.st3id = idsreverse[3].id
  dataListItemCopy.st3name = idsreverse[3].name
  emits('update:dataListItem', dataListItemCopy)

}
onMounted(()=>{

})
</script>
<style lang="scss" scoped>
.shortAnswerZHM {
  // border: 1px solid rgba(220, 223, 230, 1);
  // min-width: 1190px;
  margin-bottom: 20px;
  box-shadow:  0 1px 2px 0 rgba(199,199,199,0.16), 0 2px 6px 2px rgba(60,64,67,0.15);
  border-radius: 6px;
  overflow: hidden;
  .title-box {
    background: #D7D7D7;
    display: flex;
    padding: 5px 20px;
    border: 1px solid rgba(220, 223, 230, 1);
    line-height: 35px;
    .title {
      min-width: 64px;
    }
    .name-box {
      width: 65%;
      margin-right: 5%;
      ::v-deep .el-textarea__inner{
        height: 35px !important;
        line-height: 25px;
        font-size: 16px; 
      }
    }
    .switch-box {
      width: 12%;
      min-width: 102px;

      .el-switch--large {
        height: 27px;
      }
    }
    .btn-box {
      width: 200px;
      text-align: right;
    }
  }
  .info-box{
    background: #D7D7D7;
    display: flex;
    padding: 5px 20px;
    border-left: 1px solid rgba(220, 223, 230, 1);
    border-right: 1px solid rgba(220, 223, 230, 1);
    border-bottom: 1px solid rgba(220, 223, 230, 1);
    line-height: 35px;
    >div{
      width: 31%;
      min-width: 196px;
      margin-right: 2%;
      ::v-deep .el-input__inner{
        height: 30px !important;
        line-height: 24px;
        font-size: 16px; 
      }
    }
  }
  .options-box{
    
    border: 1px solid rgba(220, 223, 230, 1);
    border-top: none;
    padding: 5px 20px;
    .answer{
      line-height: 35px;
      min-height: 35px;
    }
    ::v-deep .el-textarea__inner{
      min-height: 35px !important;
      line-height: 30px;
      font-size: 16px; 
    }

  }
  .info-bottom{
    padding: 5px 20px;
    border: 1px solid rgba(220, 223, 230, 1);
    border-top: none;
    display: flex;
    font-size: 14px;
    line-height: 35px;
    >div{
      display: flex;
      margin-right: 20px;
      .title{
        min-width: 70px;
      }
      .time-value{
        min-width: 138px;
      }
      .name-value{
        min-width: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
    .parse{
      color: red;
      width: 30%;
      display: flex;
      ::v-deep .el-tooltip__trigger{
        width: calc(100% - 80px) !important;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
  }
}
</style>