<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>教务系统登录</h2>
      </template>

      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="college">
          <el-select v-model="loginForm.college" placeholder="请选择学院">
            <el-option label="学院A" value="A" />
            <el-option label="学院B" value="B" />
            <el-option label="学院C" value="C" />
          </el-select>
        </el-form-item>

        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" class="login-button">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  college: '',
  username: '',
  password: ''
})

const rules = reactive<FormRules>({
  college: [
    { required: true, message: '请选择学院', trigger: 'change' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // TODO: 实现实际的登录逻辑
        // 添加 root 账户验证
        if (loginForm.username === 'root' && loginForm.password === '123456') {
          localStorage.setItem('token', 'admin-token')
          localStorage.setItem('college', loginForm.college)
          localStorage.setItem('role', 'admin')
          ElMessage.success('管理员登录成功')
          router.push('/dashboard')
          return
        }
        localStorage.setItem('token', 'dummy-token')
        localStorage.setItem('college', loginForm.college)
        ElMessage.success('登录成功')
        router.push('/dashboard')
      } catch (error) {
        ElMessage.error('登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

.login-button {
  width: 100%;
}
</style>
