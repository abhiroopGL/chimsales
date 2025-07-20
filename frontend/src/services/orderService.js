import axiosInstance from "../api/axios-instance"

const orderService = {
  getOrders: () => axiosInstance.get("/api/orders/admin"),
  getOrder: (orderId) => axiosInstance.get(`/api/orders/${orderId}`),
//   createOrder: (data) => axiosInstance.post("/api/orders", data),
  updateOrder: (id, data) => axiosInstance.put(`/api/orders/${id}`, data),
//   deleteOrder: (id) => axiosInstance.delete(`/api/orders/${id}`),
}

export default orderService
