import axios from "axios";

// Create Axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI || "https://api.vulcans.co.in/api",
  withCredentials: true,
  timeout: 120000,
});

// Setup Axios interceptors
export const setUpInterceptors = (getToken: () => string | null, refreshToken: () => Promise<string | null>) => {
  // Request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      // Add token here if needed
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 unauthorized and refresh token
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/refresh-token") &&
        !originalRequest.url.includes("/logout")
      ) {
        originalRequest._retry = true;

        try {
          const token = await refreshToken();
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          alert("Session expired. Please sign in again!");
          window.location.href = "/signin";
        }
      }
      return Promise.reject(error);
    }
  );
};

//http://localhost:5000/api/auth/login

// Auth APIs
const loginUser = (data: any) => apiClient.post("/auth/login", data);
const registerUser = (data: any) => apiClient.post("/auth/register", data);
const logoutUser = () => apiClient.post("/auth/logout");

// Profile APIs
const getUserByUserId = (id: string) => apiClient.get(`/users/${id}`);
const updateUserById = (id: string, data: any) => apiClient.put(`/users/${id}`, data);
const getProfileStatus = () => apiClient.get(`/users/profile-status`);

// Password & Email APIs
const forgotPassword = (data: string) => apiClient.post("/auth/forgot-password", data);
const resetPassword = (token: string, bodyData: any) =>
  apiClient.post(`/auth/reset-password/${token}`, bodyData);
const setupPassword = (bodyData: any) => apiClient.post(`/auth/setup-password`, bodyData);
const getVerificationEmail = (token: string) => apiClient.get(`/auth/verify-email/${token}`);
const postResendVerificationEmail = (data: string) =>
  apiClient.post("/auth/resend-verification-email", data);

// Token APIs
const getRefreshToken = () => apiClient.post(`/auth/refresh-token`);
const getUserByToken = () => apiClient.get(`/auth/user`);

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserByUserId,
  updateUserById,
  getProfileStatus,
  forgotPassword,
  resetPassword,
  getVerificationEmail,
  postResendVerificationEmail,
  getRefreshToken,
  getUserByToken,
  setupPassword,
};
