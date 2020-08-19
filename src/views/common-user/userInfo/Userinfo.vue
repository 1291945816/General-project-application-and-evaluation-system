<template>
  <el-tabs value="first" style="padding-left: 10px;">
    <el-tab-pane label="个人信息设置" name="first">

      <div class="contain">
        <p style="font-size: 22px;">个人信息设置</p>
        <el-form ref="FormData" status-icon :model="FormData" :rules="rules">
          <el-row :gutter="50" class="row">
            <el-col :span="10">
              <span>学号</span>
              <div class="in">
                <el-form-item>
                  <el-input :disabled="true" :placeholder="user_id" />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="10">
              <span>姓名</span>
              <div class="in">
                <el-form-item>
                  <el-input :disabled="true" :placeholder="user_name" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="50" class="row">
            <el-col :span="10">
              <span>手机</span>
              <div class="in">
                <el-form-item prop="phonenum">
                  <el-input v-model="FormData.phonenum" placeholder="请输入手机号" />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="10">
              <span>邮箱</span>
              <div class="in">
                <el-form-item prop="emailnum">
                  <el-input v-model="FormData.emailnum" placeholder="请输入邮箱" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="50" class="row">
            <el-col :span="10">
              <span>专业</span>
              <div class="in">
                <el-form-item>
                  <el-input :placeholder="user_major" :disabled="true" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form></div>
      <el-button
        v-loading="loading"
        type="primary"
        round
        class="saveprofile"
        element-loading-spinner="el-icon-loading"
        @click="saveProps('FormData')"
      >
        保存
      </el-button>
    </el-tab-pane>
    <el-tab-pane label="账号设置" name="second">

      <div class="passwordContain">
        <p style="font-size: 22px;">密码修改</p>
        <el-form ref="passwordChange" status-icon :model="passwordChange" :rules="rules">
          <el-form-item label="旧密码" prop="oldpassword">
            <el-input v-model="passwordChange.oldpassword" type="password" />
          </el-form-item>
          <el-form-item label="新密码" prop="newpassword">
            <el-input v-model="passwordChange.newpassword" type="password" />
          </el-form-item>
          <el-form-item label="重复新密码" prop="renewpassword">
            <el-input v-model="passwordChange.renewpassword" type="password" />
          </el-form-item>
        </el-form>
      </div>
      <el-button
        v-loading="passwordLoading"
        type="primary"
        round
        class="saveprofile"
        element-loading-spinner="el-icon-loading"
        @click="changepassword()"
      >
        修改
      </el-button>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'UserInfo',

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.passwordChange.renewpassword !== '') {
          this.$refs.passwordChange.validateField('renewpassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordChange.newpassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      FormData: {
        phonenum: '',
        emailnum: ''
      },
      passwordChange: {
        oldpassword: '',
        newpassword: '',
        renewpassword: ''
      },
      loading: false,
      passwordLoading: false,
      rules: {
        phonenum: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { message: '请输入正确的手机号', trigger: 'blur' }

        ],
        emailnum: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的手机号', trigger: 'blur' }
        ],
        oldpassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newpassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, message: '密码必须包含数字和英文且长度6-20', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        renewpassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, message: '密码必须包含数字和英文且长度6-20', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }

        ]

      }
    }
  },
  computed: {
    ...mapGetters([
      'user_id',
      'user_name',
      'user_major'
    ])
  },
  created() {
    this.setprops()
  },
  methods: {
    setprops() {
      this.FormData.phonenum = this.$store.getters.user_phone
      this.FormData.emailnum = this.$store.getters.user_email
    },
    // 用于保存用户的信息
    saveProps(FormData) {
      // 这个用于加载
      this.loading = false
      // 验证有效的话就进行更新
      this.$refs[FormData].validate((valid) => {
        if (valid) {
          this.$message.success('成功了')
          // 修改vuex的信息
          // this.$store.commit('user/SET_USER_PHONE', '123')
          // this.FormData.phonenum = '123'

          console.log(this.FormData)
        } else {
          this.$message.error('成功了')
          return false
        }
      })
    },
    // 用于更新密码
    changepassword() {
      this.$refs['passwordChange'].validate((valid) => {
        if (valid) {
          this.$message.success('提交成功')
        } else {
          this.$message.error('提交失败')
        }
      })
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
  .passwordContain{
    width: 500px;
    text-align: center;
    margin: 0px auto;
  }

</style>
