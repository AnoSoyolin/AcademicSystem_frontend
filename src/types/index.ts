// 学院类型
export type College = 'A' | 'B' | 'C'

// 学生信息
export interface Student {
  id: string
  name: string
  college: College
  major: string
  grade: string
  gender: 'male' | 'female'
}

// 课程信息
export interface Course {
  id: string
  name: string
  college: College
  credit: number
  teacher: string
  maxStudents: number
  currentStudents: number
  description?: string
}

// 选课信息
export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  college: College
  enrollTime: string
  status: 'enrolled' | 'dropped'
}

// API响应类型
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

// 分页请求参数
export interface PaginationParams {
  page: number
  pageSize: number
  college?: College
}

// 分页响应数据
export interface PaginatedData<T> {
  total: number
  items: T[]
} 