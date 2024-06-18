import request from "../utils/request";

const financeService = {
  getList: (params) => request.get(`/note`, { params }),
  getById: (id, params) => request.get(`/finance_one/${id}`, { params }),
  create: (data) => request.post("/finance", data),
  update: (data) => request.put("/finance", data),
  delete: (id) => request.delete(`/note/${id}`),
};

export default financeService;
