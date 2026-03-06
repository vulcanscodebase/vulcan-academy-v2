import { apiClient } from ".";

/**
 * Initiate credit purchase payment
 * @route POST /api/payments/initiate
 * @access Protected
 */
export const initiatePaymentApi = (credits: number, couponCode?: string) => {
  return apiClient.post("/payments/initiate", { credits, couponCode });
};

/**
 * Verify payment after Razorpay callback
 * @route POST /api/payments/verify
 * @access Protected
 */
export const verifyPaymentApi = (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  return apiClient.post("/payments/verify", data);
};

/**
 * Get user's transaction history with pagination
 * @route GET /api/payments/history
 * @access Protected
 */
export const getUserTransactionsApi = (page: number = 1, limit: number = 10) => {
  return apiClient.get(`/payments/history?page=${page}&limit=${limit}`);
};
