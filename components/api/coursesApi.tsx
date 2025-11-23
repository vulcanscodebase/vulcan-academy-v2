import { apiClient } from ".";
import { AxiosResponse } from "axios";

// --------- Types ---------
export interface Course {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  progress?: number;
}

export interface Pagination {
  page: number;
  totalPages: number;
  totalItems: number;
}

// --------- API Calls ---------

/**
 * @desc Fetch all courses (Public)
 * @route GET /api/courses
 */
export const getAllCourses = (
  page?: number,
  limit?: number
): Promise<AxiosResponse<any>> => {
  return apiClient.get(`/courses`, {
    params: {
      page,
      limit,
    },
  });
};

/**
 * @desc Get Purchased Courses for User Dashboard
 * @route GET /api/orders/purchased-course
 * @access Private (User only)
 */
export const getPurchasedCoursesApi = (): Promise<AxiosResponse<any>> => {
  return apiClient.get(`/orders/purchased-course`);
};

/**
 * @desc Enter (start) a course
 * @route POST /api/courses/enter
 * @access Private (requires token)
 */
export const enterCourseApi = (
  courseId: string
): Promise<AxiosResponse<any>> => {
  return apiClient.post(`/courses/enter`, { courseId });
};
