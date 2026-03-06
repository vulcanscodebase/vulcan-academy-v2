import axios from "axios";

// Create Axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI || "https://api.vulcanprep.com/api",
  withCredentials: true,
  timeout: 120000,
});

// Apply Request interceptor globally
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Apply Response interceptor globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 unauthorized
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/refresh-token") &&
      !originalRequest.url?.includes("/logout") &&
      !originalRequest.url?.includes("/login")
    ) {
      originalRequest._retry = true;
      try {
        // Try refreshing the token automatically
        const refreshResponse = await apiClient.post("/auth/refresh-token");
        if (refreshResponse.data?.token) {
          localStorage.setItem("token", refreshResponse.data.token);
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed, redirecting to login:", refreshError);
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/signin";
        }
      }
    }
    return Promise.reject(error);
  }
);


// Auth APIs
const loginUser = (data: any) => apiClient.post("/auth/login", data);
const registerUser = (data: any) => apiClient.post("/auth/register", data);
const logoutUser = () => apiClient.post("/auth/logout");

// Profile APIs
const getUserByUserId = (id: string) => apiClient.get(`/users/${id}`);
const updateUserById = (id: string, data: any) => apiClient.put(`/users/${id}`, data);
const getProfileStatus = () => apiClient.get(`/users/profile-status`);

// Password & Email APIs
const forgotPassword = (data: any) => apiClient.post("/auth/forgot-password", data);
const resetPassword = (token: string, bodyData: any) =>
  apiClient.post(`/auth/reset-password/${token}`, bodyData);
const setupPassword = (bodyData: any) => apiClient.post(`/auth/setup-password`, bodyData);
const getVerificationEmail = (token: string) => apiClient.get(`/auth/verify-email/${token}`);
const postResendVerificationEmail = (data: string) =>
  apiClient.post("/auth/resend-verification-email", data);
const changePassword = (data: any) => apiClient.post("/auth/change-password", data);

// Token APIs
const getRefreshToken = () => apiClient.post(`/auth/refresh-token`);
const getUserByToken = () => apiClient.get(`/auth/user`);
const checkUserExists = (data: { email: string }) => apiClient.post("/auth/check-email", data);
const completeOnboarding = () => apiClient.post("/auth/complete-onboarding");

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
  checkUserExists,
  changePassword,
  completeOnboarding,
};
