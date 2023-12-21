<template>
    <Suspense>
     
        <left-tree></left-tree>
    </Suspense>
        
        
   
</template>

<script setup>
// import LeftTree from "./components/TreeData.vue"
import { defineAsyncComponent } from 'vue'
const LeftTree = defineAsyncComponent(() =>
  import('./components/TreeData.vue')
)

</script>

<style lang="scss" scoped>


</style>