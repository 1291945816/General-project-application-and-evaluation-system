<template>
  <el-tabs style="padding-left: 10px;">
    <el-tab-pane label="个人信息设置" name="first">

      <div class="contain">
        <p style="font-size: 22px;">个人信息设置</p>
        <el-row :gutter="50" class="row">
          <el-col :span="10">
            <span>学号</span>
            <div class="in">
              <el-input v-model="user_id" :disabled="true" />
            </div>
          </el-col>
          <el-col :span="10">
            <span>姓名</span>
            <div class="in">
              <el-input v-model="user_name" :disabled="true" />
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="50" class="row">
          <el-col :span="10">
            <span>手机</span>
            <div class="in">
              <el-input v-model="phone" />
            </div>
          </el-col>
          <el-col :span="10">
            <span>邮箱</span>
            <div class="in">
              <el-input v-model="email" />
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="50" class="row">
          <el-col :span="10">
            <span>专业</span>
            <div class="in">
              <el-input v-model="major" :disabled="true" />
            </div>
          </el-col>
        </el-row>
      </div>
      <el-button type="primary" round class="saveprofile">保存</el-button>
    </el-tab-pane>
    <el-tab-pane label="账号设置" name="second" />
  </el-tabs>
</template>
<script>
export default {
  name: 'UserInfo',
  data() {
    return {
      userid: '',
      user_name: '黄丕松',
      phone: '',
      email: '',
      major: '软件工程'
    }
  }

}

</script>
<style>
  .saveprofile {
    display: block;
    margin: 0px auto;
  }
  .contain{
    padding-top: 10px;
    padding-left: 20px;
  }
  .row{
    padding-top: 20px;
    padding-left: 20px;

  }
  .in{
    padding-top: 10px;
  }
</style>
