import request from "../utils/request"

const statusService = {
  getList: (projectId) =>
    request.get(`/status`, { params: { project_id: projectId } }),
  create: (data) => request.post("/status", data),
  update: (data) => request.put("/status", data),
  updateOrder: (id, orderNumber) =>
    request.patch(`/status/${id}/${orderNumber}`),
  delete: (id) => request.delete(`/status/${id}`),
  // DEFAULTS
  getDefaultList: (statusGroupId) =>
    request.get("/default-status", {
      params: { "status-group-id": statusGroupId },
    }),
  createDefault: (data) => request.post("/default-status", data),
  updateDefault: (data) => request.put("/default-status", data),
  deleteDefault: (id) => request.delete(`/default-status/${id}`),
  updateDefaultOrder: (id, orderNumber) =>
    request.patch(`/default-status/${id}/${orderNumber}`),
}

export default statusService
