<template>
  <div class="header-contaner" >
    <el-row justify="start" align="middle" style="height: 100%">
      <el-col :span="12"
        class="left">
        <el-icon size="22" color="white"><HomeFilled /></el-icon>
        <span style="">智慧面后台管理系统</span>
      </el-col>
      <el-col :span="12"
        class="right"><div class="grid-content ep-bg-purple-light" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.header-contaner{
    height:100%;
    color:#fff;
    .left{
        display: flex;
        align-items: center;
        span{
           
            margin-left:1rem;

        }
    }
}
</style>