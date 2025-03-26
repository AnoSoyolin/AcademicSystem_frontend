<template>
  <div class="enrollment-container">
    <div class="header">
      <h2>选课管理</h2>
      <el-button type="primary" @click="handleAdd">选课</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="enrollments"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="选课编号" width="120" />
      <el-table-column prop="studentId" label="学号" width="120" />
      <el-table-column prop="courseId" label="课程编号" width="120" />
      <el-table-column prop="college" label="学院" width="100">
        <template #default="{ row }">
          学院{{ row.college }}
        </template>
      </el-table-column>
      <el-table-column prop="enrollTime" label="选课时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'enrolled' ? 'success' : 'info'">
            {{ row.status === 'enrolled' ? '已选' : '已退' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'enrolled'"
            type="danger"
            link
            @click="handleDrop(row)"
          >
            退课
          </el-button>
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

    <!-- 选课对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="选课"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="form.studentId" />
        </el-form-item>
        <el-form-item label="课程" prop="courseId">
          <el-select
            v-model="form.courseId"
            filterable
            placeholder="请选择课程"
            @change="handleCourseChange"
          >
            <el-option
              v-for="course in availableCourses"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            >
              <span>{{ course.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                剩余名额：{{ course.maxStudents - course.currentStudents }}
              </span>
            </el-option>
          </el-select>
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
import { getEnrollments, createEnrollment, dropEnrollment } from '../api/enrollment'
import { getAvailableCourses } from '../api/course'
import type { Enrollment, Course } from '../types'

const loading = ref(false)
const submitting = ref(false)
const enrollments = ref<Enrollment[]>([])
const availableCourses = ref<Course[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  studentId: '',
  courseId: '',
  college: ''
})

const rules: FormRules = {
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }]
}

const fetchEnrollments = async () => {
  loading.value = true
  try {
    const res = await getEnrollments({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    enrollments.value = res.data.items
    total.value = res.data.total
  } catch (error) {
    console.error('获取选课列表失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchAvailableCourses = async () => {
  try {
    const res = await getAvailableCourses({
      page: 1,
      pageSize: 100
    })
    availableCourses.value = res.data.items
  } catch (error) {
    console.error('获取可选课程失败:', error)
  }
}

const handleAdd = () => {
  Object.assign(form, {
    studentId: '',
    courseId: '',
    college: ''
  })
  dialogVisible.value = true
}

const handleCourseChange = (courseId: string) => {
  const course = availableCourses.value.find(c => c.id === courseId)
  if (course) {
    form.college = course.college
  }
}

const handleDrop = async (row: Enrollment) => {
  try {
    await ElMessageBox.confirm('确定要退选该课程吗？', '提示', {
      type: 'warning'
    })
    await dropEnrollment(row.id)
    ElMessage.success('退课成功')
    fetchEnrollments()
  } catch (error) {
    console.error('退课失败:', error)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await createEnrollment(form)
        ElMessage.success('选课成功')
        dialogVisible.value = false
        fetchEnrollments()
      } catch (error) {
        console.error('选课失败:', error)
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchEnrollments()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchEnrollments()
}

onMounted(() => {
  fetchEnrollments()
  fetchAvailableCourses()
})
</script>

<style scoped>
.enrollment-container {
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