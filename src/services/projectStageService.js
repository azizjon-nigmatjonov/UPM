import request from "../utils/request"

const projectStageService = {
  getList: (params) => request.get("stage", { params }),
  create: (data) => request.post("/stage", data),
  update: (data) => request.put("/stage", data),
  delete: (id) => request.delete(`/stage/${id}`),
  // DEFAULTS
  getDefaultList: (params) => request.get("default_stages", { params }),
  createDefault: (data) => request.post("/default_stages", data),
  updateDefault: (data) => request.put("/default_stages", data),
  deleteDefault: (id) => request.delete(`/default_stages/${id}`),
}

export default projectStageService
