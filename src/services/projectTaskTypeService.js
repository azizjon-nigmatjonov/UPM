import request from "../utils/request";

const projectTaskTypeService = {
  getList: (params) => request.get(`/project_task_type`, { params }),
  getById: (id, params) => request.get(`/project_task_type/${id}`, { params }),
  create: (data) => request.post("/project_task_type", data),
  update: (data) => request.put("/project_task_type", data),
  updateOrder: (taskId, orderNumber) =>
    request.patch(`/project_task_type/${taskId}/${orderNumber}`),
  delete: (id) => request.delete(`/project_task_type/${id}`),
  // DEFAULTS
  getDefaults: (params) => request.get(`/default-task-type`, { params }),
  createDefault: (data) => request.post("/default-task-type", data),
  updateDefault: (data) => request.put("/default-task-type", data),
  deleteDefault: (id) => request.delete(`/default-task-type/${id}`),
};

export default projectTaskTypeService;
