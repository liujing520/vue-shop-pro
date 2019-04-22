<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/img/logo.png" alt>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="userpass">
          <el-input v-model="loginForm.userpass" type="password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :push="15">
            <el-button type="primary" @click="login()">登录</el-button>
            <el-button type="info" @click="reset()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // 管理员登录系统
    login() {
      // 对登录的表单进行整体验证
      this.$refs.loginFormRef.validate(async valid => {
        // valid:校验成功/失败的标志，true：成功，false：失败
        if (valid === true) {
          // 账号的真实性校验(用户名和密码)
          const { data: dt } = await this.$http.post('/login', {
            username: this.loginForm.username,
            password: this.loginForm.userpass
          })
          // 登录失败时提示(用户名或者密码错误)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 通过dt把服务器端返回的token在sessionStorage里保存好
          window.sessionStorage.setItem('token', dt.data.token)
          // 编程式导航，到达后台首页面
          this.$router.push('/home')
        }
      })
    },
    reset() {
      // 表单重置
      this.$refs.loginFormRef.resetFields()
    }
  },
  data() {
    return {
      loginFormRules: {
        username: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        userpass: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      // 用户登录表单数据对象（用户名，密码）
      loginForm: {
        username: '',
        userpass: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  .login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
    .avatar-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
</style>
