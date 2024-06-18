import request from "../utils/request";

const sprintService = {
  getList: (params) => request.get("/sprint", { params }),
  getListInProject: (projectId) => request.get("/sprint", { params: { project_id: projectId } }),
  getSprintDashboardList: (project_id, params) => request.get(`sprint/sprint_dashboard_report/${project_id}`, { params }),
  getById: (id) => request.get(`/sprint/${id}`),
  getByPost: (data) => request.post(`/sprint/stage-ids`, data),
  create: (data) => request.post('/sprint', data),
  update: (data) => request.put('sprint', data),
  updateOrder: (id, orderNumber) => request.patch(`/sprint/${id}/${orderNumber}`),
  delete: (id) => request.delete(`/sprint/${id}`),
  addSubtaskToSprint: (data) => request.post('/sprint/subtask_items', data),
  updateSprintSubtaskDeadline: (subtaskId, data) => request.patch(`/sprint/subtask_item_id/${subtaskId}`, data),
  addMultipleSubtaskToSprint: (data) => request.post('/sprint/subtask_items_multiple', data),
  removeSubtaskFromSprint: (sprintId, stepId, subtaskId) => request.delete(`/sprint/${sprintId}/step_id/${stepId}/id/${subtaskId}`),
  confirmSprintStep: (data) => request.put('/sprint_update_step_confirm', data), 
  moveSprintToNextStep: (data) => request.post('/sprint/steps', data), 
  updateSprintSubtaskStatus: (data) => request.put('/sprint/sprint_subtask_status', data),
  updateSprintSubtaskOrder: (sprintId, stepId, subtaskId, orderNumber) => request.patch(`/sprint/${sprintId}/step_id/${stepId}/id/${subtaskId}/${orderNumber}`)
}

export default sprintService


