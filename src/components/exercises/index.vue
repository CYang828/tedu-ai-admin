<template>
  <div class="exercises-model">
    <!-- {{ dataList[1] }}2222222 -->
    <component
      v-for="(val,idx) in dataList"
      :key="JSON.stringify(val.id)"
      :is="typelist[val.type]"
      v-model:dataListItem = "dataList[idx]"
      v-model:dataList="dataList"
      @updateList="updateListFn"
    ></component>
  </div>
</template>
<script setup>
import { ref, reactive, defineProps, inject, defineAsyncComponent, watch, defineEmits  } from "vue";
const emits = defineEmits(['updateList']);
const RadioZHM = defineAsyncComponent(() =>
  import("@/components/exercises/RadioZHM.vue")
);
const CheckZHM = defineAsyncComponent(() =>
  import("@/components/exercises/CheckZHM.vue")
);
const shortAnswerZHM = defineAsyncComponent(() =>
  import("@/components/exercises/shortAnswerZHM.vue")
);
const dataList = ref(inject('dataList'))
const typelist = ref({
  1: RadioZHM,
  2: CheckZHM,
  3: shortAnswerZHM,
}) 
const updateListFn = ()=>{
  emits('updateList')
}
// const props = defineProps({
//   // 列表数据
//   dataList: {
//     type: Array,
//     default: () => []
//   }
// })

// watch(
//   () => dataList.value,
//   (newValue) => {
//     console.log(newValue, 'newValuenewValuenewValuenewValue')
//   },
//   { deep: true }
// )


</script>
<style lang="scss" scoped>
.exercises-model{
  background:#fff;
}
</style>