import axiosInstance from "../api/axios-instance"

const invoiceService = {
  getInvoices: () => axiosInstance.get("/api/invoice"),
  getInvoice: (id) => axiosInstance.get(`/api/invoice/${id}`),
  createInvoice: (data) => axiosInstance.post("/api/invoice", data),
  updateInvoice: (id, data) => axiosInstance.put(`/api/invoice/${id}`, data),
  deleteInvoice: (id) => axiosInstance.delete(`/api/invoice/${id}`),
  sendInvoice: (id) => axiosInstance.post(`/api/invoice/${id}/send`),
  downloadInvoice: (id) => axiosInstance.get(`/api/invoice/${id}/download`, { responseType: "blob" }),
}

export default invoiceService
