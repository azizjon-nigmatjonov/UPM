
import request from "../utils/request";

const taskService = {
  getList: (epicId) => request.get(`/task`, { params: { epic_id: epicId } }),
  getByProjectId: (params) => request.get(`/task/get-list`, {params}),
  getById: (id) => request.get(`/task/${id}`),
  create: (data) => request.post('/task', data),
  update: (data) => request.put('/task', data),
  updateOrder: (id, orderNumber) => request.patch(`/task/${id}/${orderNumber}`),
  delete: (id) => request.delete(`/task/${id}`),
  getListInsideEpic: (epicId) => request.get(`/task/epic_id/${epicId}`),
  updateTime: (taskId, data) => request.patch(`/task/time/${taskId}`, data)
}

export default taskService