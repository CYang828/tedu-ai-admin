<template>
  <div class="RadioZHM"  @dblclick="handleDoubleClick(dataListItem)">
    <div class="title-box">
      <div class="title">多选题：</div>
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
      <el-checkbox-group v-model="checkList" @change="changeCheck" @click.native.stop>
        <el-checkbox :class="{'noEdit':!isEdit}" :label="idx" :key="idx" v-for="(item,idx) in dataListItem.options" :disabled="!isEdit">
          <span>{{ getLetterFromNumber(idx) }}：</span>
          <span v-show="!isEdit">{{ item.name }}</span>
          <el-input
            v-show="isEdit"
            v-model="item.name"
            placeholder="请输入"
            show-word-limit
          />
          <el-button style="margin-left: 20px;" v-show="isEdit" type="danger" @click.prevent="delOptionsFn(item,idx)">删除</el-button>
          <el-button v-if="idx === dataListItem.options.length - 1" style="margin-left: 20px;" type="primary" @click.prevent="addOptionsFn(dataListItem)" v-show="isEdit">添加选项</el-button>
        </el-checkbox>
      </el-checkbox-group>
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
import questionsBankApi from "@/utils/http/questionBank.serve.js";
import { ref ,getCurrentInstance, onMounted, inject } from "vue";

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
const checkList = ref([])
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
// 双击事件
const handleDoubleClick = (dataListItem)=>{
  isEdit.value = true
}
// 获取题号 0对应A
const getLetterFromNumber = (num)=>{
  const baseCharCode = 'A'.charCodeAt(0); // 获取字符 'A' 的编码值
  // 进行运算，得到对应的字符
  const letter = String.fromCharCode(baseCharCode + num);
  return letter;
}
const changeCheck = (item)=>{
  let dataListItemCopy = JSON.parse(JSON.stringify(props.dataListItem))
  dataListItemCopy.options = dataListItemCopy.options.map((val,idx)=>{
    if(item.includes(idx)){
      val.isAnswer = 1
    }else{
      val.isAnswer = 0
    }
    return val
  })
  emits('update:dataListItem', dataListItemCopy)
}
// 删除选项
const delOptionsFn = (item,idx)=>{
  let dataListItemCopy = JSON.parse(JSON.stringify(props.dataListItem))
  if(dataListItemCopy.options.length == 1){
    ElMessage({
      message: '选项最少1个',
      type: 'warning',
    })
    return
  }
  dataListItemCopy.options.splice(idx,1)
  emits('update:dataListItem', dataListItemCopy)
}
// 添加选项
const addOptionsFn = (dataListItem)=>{
  // let dataListItemCopy = JSON.parse(JSON.stringify(dataListItem))
  if(dataListItem.options.length == 24){
    ElMessage({
      message: '选项最多24个',
      type: 'warning',
    })
    return
  }
  dataListItem.options.push({
    "id": dataListItem.options.length+1 + (new Date().getTime() + ''),
    "questionId": null,
    "key": null,
    "name": "",
    "isAnswer": 0
  })
  // emits('update:dataListItem', dataListItemCopy)
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
// 修改保存
const saveFn = async (dataListItem)=>{
  let answerIndex = []
  dataListItem.options.forEach((item,idx)=>{
    answerIndex.push(idx)
  })
  let data = {
    answerIndex:JSON.stringify(answerIndex), //答案索引
    deleted:0,
    options:JSON.stringify(dataListItem.options),
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
// 删除
const delFn = function (dataListItem) {
  ElMessageBox.confirm(
    '确认删除吗？',
    '删除试题',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then( async () => {
    const res = await questionsBankApi.deleteExercise({
      id:dataListItem.id
    });
    emits('updateList')

  }).catch(() => {

  })
}
onMounted(()=>{
  checkList.value = []
  props.dataListItem.options.filter((item,idx)=>{
    if(item.isAnswer === 1){
      checkList.value.push(idx)
      return item
    }
  })
})
</script>
<style lang="scss" scoped>
.RadioZHM {
  margin-bottom: 20px;
  // border: 1px solid rgba(220, 223, 230, 1);

  // min-width: 1190px;
  .title-box {
    background: #D7D7D7;
    display: flex;
    padding: 5px 20px;
    border: 1px solid #333;
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
    border-left: 1px solid #333;
    border-right: 1px solid #333;
    border-bottom: 1px solid #333;
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
    border-left: 1px solid rgba(220, 223, 230, 1);
    border-right: 1px solid rgba(220, 223, 230, 1);
    .el-checkbox-group{
      .el-checkbox{
        display: flex;
        padding: 5px 20px;
        font-size: 16px;
        height: 35px;
        border-bottom: 1px solid rgba(220, 223, 230, 1);
        align-items: center;
        margin-right: 0px !important;
        ::v-deep .el-checkbox__label{
          font-size: 16px !important; 
          color: #000 !important;
          display: inline-block;
          width: calc(100% - 120px);
        }
        ::v-deep  .el-checkbox__input{
          width: 16px !important;
          height: 16px !important;
        }
        ::v-deep .el-input{
          width: 50% !important;
        }
        ::v-deep .el-input__inner{
          height: 30px !important;
          line-height: 24px;
          font-size: 16px; 
         
        }
      }
      .is-checked{
        background: rgba(129, 211, 248, 1);
      }
      .noEdit{
        ::v-deep  .el-checkbox__inner{
          display: none;
        }

      }
    }
    .item-box{
      display: flex;
      padding: 5px 20px;
      height: 35px;
      line-height: 35px;
      border-bottom: 1px solid rgba(220, 223, 230, 1);
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