import api from './config'
import type { Course, PaginationParams, PaginatedData, ApiResponse } from '../types'

export const getCourses = (params: PaginationParams) => {
  return api.get<ApiResponse<PaginatedData<Course>>>('/courses', { params })
}

export const getCourseById = (id: string) => {
  return api.get<ApiResponse<Course>>(`/courses/${id}`)
}

export const createCourse = (data: Omit<Course, 'id'>) => {
  return api.post<ApiResponse<Course>>('/courses', data)
}

export const updateCourse = (id: string, data: Partial<Course>) => {
  return api.put<ApiResponse<Course>>(`/courses/${id}`, data)
}

export const deleteCourse = (id: string) => {
  return api.delete<ApiResponse<void>>(`/courses/${id}`)
}

export const getAvailableCourses = (params: PaginationParams) => {
  return api.get<ApiResponse<PaginatedData<Course>>>('/courses/available', { params })
} 