import { apiClient } from ".";

/**
 * Create an order from the cart
 * @route POST /api/orders/create
 * @access Private (User only)
 */
export const createOrderApi = async () => {
  return apiClient.post("/orders/create");
};

/**
 * Get details of a specific order
 * @route GET /api/orders/:orderId
 * @access Private (User only)
 */
export const getOrderDetailsApi = async (orderId: string) => {
  return apiClient.get(`/orders/${orderId}`);
};

/**
 * Get all orders of a user
 * @route GET /api/orders
 * @access Private (User only)
 */
export const getAllOrdersApi = async () => {
  return apiClient.get("/orders");
};

/**
 * Apply Coupon & Update Order Total
 * @route POST /api/orders/apply-coupon
 * @access Private (User only)
 */
export const applyCouponApi = (orderId: string, couponCode: string) => {
  return apiClient.post("/orders/apply-coupon", { orderId, couponCode });
};

/**
 *  Initiate Razorpay Payment (Testing or Real)
 * @route POST /api/orders/initiate-razorpay
 * @access Private (User only)
 */
export const initiateRazorPePaymentApi = (orderId: string) => {
  return apiClient.post("/orders/initiate-razorpay", { orderId });
};

// If later you want to use PhonePe real payment instead of Razorpay:
// export const initiatePhonePePaymentApi = async (orderId: string) => {
//   return apiClient.post("/orders/initiate-payment", { orderId });
// };
