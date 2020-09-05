<template>
  <div>
    <el-tabs value="first" class="reviewTab">
      <el-tab-pane label="我的未评审项目" name="first"><NotReview /></el-tab-pane>
      <el-tab-pane label="我的已评审项目" name="second"><Reviewed /></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import NotReview from './NotReview'
import Reviewed from './Reviewed'
export default {
  components: { NotReview, Reviewed }
}
</script>
<style scoped>
  .reviewTab{
    margin-left: 10px;

  }
</style>
