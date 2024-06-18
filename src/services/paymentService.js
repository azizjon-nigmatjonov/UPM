import request from "../utils/request";

const paymentService = {
  getList: (params, project_id) =>
    request.get(`/finance/${project_id}`, { params }),
  getById: (id, params) => request.get(`/user/${id}`, { params }),
  getPaymentTypeList: (params) => request.get("/payment_type", { params }),
  create: (data) => request.post("/user", data),
  update: (data) => request.put("/finance", data),
  delete: (id) => request.delete(`/finance/${id}`),
};

export default paymentService;
