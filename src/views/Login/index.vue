<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">某某某健身房-登录</div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
        <el-form-item placeholder="请输入用户名" label="账号" prop="name">
          <el-input v-model="loginForm.name" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button class="reset_btn" @click="resetForm">重置</el-button>
          <el-button type="primary" class="login_btn" @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        name: '',
        password: '',
        remember: false
      },
      loginRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (localStorage.getItem('userInfo')) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.loginForm = userInfo
    }
  },
  methods: {
    // 登录
    submitForm() {
      this.$refs.loginForm.validate(async valid => {
        if (!valid) return
        // 校验通过
        const obj = { ...this.loginForm }
        delete obj.remember
        await this.$store.dispatch('user/userLogin', obj)
        // 记住账号密码
        if (this.loginForm.remember) {
          localStorage.setItem('userInfo', JSON.stringify(this.loginForm))
        } else {
          localStorage.removeItem('userInfo')
        }
        this.$message.success('登录成功.')
        // 跳回到返回页/或是首页
        this.$router.push(this.$route.query.redirect || '/')
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.login_body {
  display: flex;
}
.bg {
  width: 60vw;
  height: 100vh;
  background: url('~@/assets/login-bg.svg') no-repeat;
  background-position: right top;
  background-size: cover;
}
.box {
  margin: 200px 10% 0;
  flex: 1;
  .title {
    padding-bottom: 76px;
    font-size: 26px;
    font-weight: 500;
    color: #1e2023;
  }
  ::v-deep() {
    .ant-form-item {
      display: flex;
      margin-bottom: 62px;
      flex-direction: column;
    }
    .ant-form-item-label label {
      font-size: 16px;
      color: #8b929d;
    }
    .ant-input,
    .ant-input-password {
      border-radius: 8px;
    }
  }
}
// .login_btn {
//   width: 100%;
// }
</style>
