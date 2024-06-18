
import request from "../utils/request";

const subtaskService = {
  getList: (params) => request.get(`/subtask`, { params }),
  getListView: (data) => request.post(`/subtask/get-list`, data),
  getById: (id) => request.get(`/subtask/${id}`),
  create: (data) => request.post('/subtask', data),
  update: (data) => request.put('/subtask', data),
  updateStatus: (data) => request.put('/subtask-status', data),
  updateOrder: (id, orderNumber) => request.patch(`/subtask/${id}/${orderNumber}`),
  updateOrderInBoard: ({ sprintId, statusId, id, boardOrderNumber, stepId, params}) => request.patch(`/sprint/${sprintId}/project_sprint_step_id/${stepId}/id/${id}/status_id/${statusId}/${boardOrderNumber}`, null, { params }),
  delete: (id) => request.delete(`/subtask/${id}`),
  updateAssigneeUsers: (data) => request.patch(`/subtask/assignee-users`, data),
  addAttachFile: (data) => request.post('/subtask/file', data),
  deleteAttachFile: (subtaskId, fileId) => request.delete(`/subtask/${subtaskId}/file/${fileId}`),
  updateTime: (subtaskId, data) => request.patch(`/subtask/time/${subtaskId}`, data) 
}

export default subtaskService