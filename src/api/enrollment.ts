import api from './config'
import type { Enrollment, PaginationParams, PaginatedData, ApiResponse } from '../types'

export const getEnrollments = (params: PaginationParams) => {
  return api.get<ApiResponse<PaginatedData<Enrollment>>>('/enrollments', { params })
}

export const getEnrollmentById = (id: string) => {
  return api.get<ApiResponse<Enrollment>>(`/enrollments/${id}`)
}

export const createEnrollment = (data: Omit<Enrollment, 'id' | 'enrollTime'>) => {
  return api.post<ApiResponse<Enrollment>>('/enrollments', data)
}

export const dropEnrollment = (id: string) => {
  return api.put<ApiResponse<Enrollment>>(`/enrollments/${id}/drop`)
}

export const getStudentEnrollments = (studentId: string, params: PaginationParams) => {
  return api.get<ApiResponse<PaginatedData<Enrollment>>>(`/students/${studentId}/enrollments`, { params })
}

export const getCourseEnrollments = (courseId: string, params: PaginationParams) => {
  return api.get<ApiResponse<PaginatedData<Enrollment>>>(`/courses/${courseId}/enrollments`, { params })
} 