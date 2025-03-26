import api from './config'
import type { Student, PaginationParams, PaginatedData, ApiResponse } from '../types'

export const getStudents = (params: PaginationParams) => {
  return api.get<ApiResponse<PaginatedData<Student>>>('/students', { params })
}

export const getStudentById = (id: string) => {
  return api.get<ApiResponse<Student>>(`/students/${id}`)
}

export const createStudent = (data: Omit<Student, 'id'>) => {
  return api.post<ApiResponse<Student>>('/students', data)
}

export const updateStudent = (id: string, data: Partial<Student>) => {
  return api.put<ApiResponse<Student>>(`/students/${id}`, data)
}

export const deleteStudent = (id: string) => {
  return api.delete<ApiResponse<void>>(`/students/${id}`)
} 