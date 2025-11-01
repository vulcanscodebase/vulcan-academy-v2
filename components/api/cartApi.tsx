import { apiClient } from ".";

// Get user's cart
const getCartApi = () => apiClient.get("/cart");

// Add item to cart
const addItemToCartApi = (data: any) => apiClient.post("/cart", data);

// Update item quantity
const updateItemQuantityApi = (productId: string, qty: number) =>
  apiClient.put(`/cart/${productId}`, { quantity: qty });

// Delete a specific cart item
const deleteItemFromCartApi = (productId: string) =>
  apiClient.delete(`/cart/item/${productId}`);

// Clear entire cart
const deleteEntireCartApi = () => apiClient.delete("/cart");

export {
  getCartApi,
  addItemToCartApi,
  updateItemQuantityApi,
  deleteItemFromCartApi,
  deleteEntireCartApi,
};
