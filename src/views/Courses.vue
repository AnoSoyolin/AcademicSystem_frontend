<template>
  <div class="courses-container">
    <div class="header">
      <h2>课程管理</h2>
      <el-button type="primary" @click="handleAdd">添加课程</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="courses"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="课程编号" width="120" />
      <el-table-column prop="name" label="课程名称" width="150" />
      <el-table-column prop="college" label="开课学院" width="100">
        <template #default="{ row }">
          学院{{ row.college }}
        </template>
      </el-table-column>
      <el-table-column prop="credit" label="学分" width="80" />
      <el-table-column prop="teacher" label="授课教师" width="120" />
      <el-table-column prop="maxStudents" label="最大人数" width="100" />
      <el-table-column prop="currentStudents" label="当前人数" width="100" />
      <el-table-column prop="description" label="课程描述" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加/编辑课程对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加课程' : '编辑课程'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="开课学院" prop="college">
          <el-select v-model="form.college">
            <el-option label="学院A" value="A" />
            <el-option label="学院B" value="B" />
            <el-option label="学院C" value="C" />
          </el-select>
        </el-form-item>
        <el-form-item label="学分" prop="credit">
          <el-input-number v-model="form.credit" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher">
          <el-input v-model="form.teacher" />
        </el-form-item>
        <el-form-item label="最大人数" prop="maxStudents">
          <el-input-number v-model="form.maxStudents" :min="1" :max="200" />
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入课程描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api/course'
import type { Course } from '../types'

const loading = ref(false)
const submitting = ref(false)
const courses = ref<Course[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  college: '',
  credit: 1,
  teacher: '',
  maxStudents: 50,
  currentStudents: 0,
  description: ''
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  college: [{ required: true, message: '请选择开课学院', trigger: 'change' }],
  credit: [{ required: true, message: '请输入学分', trigger: 'blur' }],
  teacher: [{ required: true, message: '请输入授课教师', trigger: 'blur' }],
  maxStudents: [{ required: true, message: '请输入最大人数', trigger: 'blur' }]
}

const fetchCourses = async () => {
  loading.value = true
  try {
    const res = await getCourses({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    courses.value = res.data.items
    total.value = res.data.total
  } catch (error) {
    console.error('获取课程列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(form, {
    name: '',
    college: '',
    credit: 1,
    teacher: '',
    maxStudents: 50,
    currentStudents: 0,
    description: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: Course) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row: Course) => {
  try {
    await ElMessageBox.confirm('确定要删除该课程吗？', '提示', {
      type: 'warning'
    })
    await deleteCourse(row.id)
    ElMessage.success('删除成功')
    fetchCourses()
  } catch (error) {
    console.error('删除课程失败:', error)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (dialogType.value === 'add') {
          await createCourse(form)
          ElMessage.success('添加成功')
        } else {
          await updateCourse(form.id, form)
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        fetchCourses()
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchCourses()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchCourses()
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.courses-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 