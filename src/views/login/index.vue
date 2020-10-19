<template>
  <div class="dowebok">
    <div class="container-login100">

      <div class="wrap-login100">
        <div class="login100-pic js-tilt" data-tilt>
          <img src="../../styles/images/img-01.png" alt="IMG">
        </div>

        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login100-form validate-form" auto-complete="on" label-position="left">
          <span class="login100-form-title1">
            通用项目评审与申报系统
          </span>
          <span class="login100-form-title">
            用户登录
          </span>
          <el-form-item prop="username" class="wrap-input100 validate-input">

            <input
              ref="username"
              v-model="loginForm.username"
              class="input100"
              placeholder="学号/工号"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            >
            <span class="focus-input100" />
            <span class="symbol-input100">
              <i class="fa fa-user" aria-hidden="true" />
            </span>
          </el-form-item>
          <br>

          <el-form-item prop="password" class="wrap-input100 validate-input">
            <input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              class="input100"
              @keyup.enter.native="handleLogin"
            >
            <span class="focus-input100" />
            <span class="symbol-input100">
              <i class="fa fa-lock" aria-hidden="true" />
            </span>
          </el-form-item><br>

          <div class="container-login100-form-btn">
            <el-button :loading="loading" class="login100-form-btn" type="primary" @click.native.prevent="handleLogin">登录</el-button>
          </div>

        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的学号/工号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能少于6!!!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '1800300916',
        password: 'hps19991214'

      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      fit: 'fill',
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // 校验是否通过 this.loginForm
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            const h = this.$createElement
            this.$notify.info({
              title: '友情提示',
              message: h('i', { style: 'color: teal' }, '欢迎您，请刷新一下界面，以便获取更好的用户体验')
            })
            this.$router.push('/') // 登陆成功后重定向到通知页
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style  scoped>

@import url('../../styles/fonts/font-awesome-4.7.0/css/font-awesome.min.css');
@import url('../../styles/util.css');
@import url('../../styles/main.css');

</style>
