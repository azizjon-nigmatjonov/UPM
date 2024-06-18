import request from "../utils/request"

const statusTypeService = {
  getList: (params) => request.get(`/status-group`, { params }),
  getById: (id, params) => request.get(`/status-group/${id}`, { params }),
  create: (data) => request.post("/status-group", data),
  update: (data) => request.put("/status-group", data),
  updateOrder: (id, orderNumber) =>
    request.patch(`/status-group/${id}/${orderNumber}`),
  delete: (id) => request.delete(`/status-group/${id}`),
  // DEFAULTS
  // getDefaultList: (params) => request.get(`/default-status-group`, { params }),
  // createDefault: (data) => request.post("/default-status-group", data),
  // updateDefault: (data) => request.put("/default-status-group", data),
  // deleteDefault: (id) => request.delete(`/default-status-group/${id}`),
  // updateDefaultOrder: (id, orderNumber) =>
  //   request.patch(`/default-status-group/${id}/${orderNumber}`),
}

export default statusTypeService
