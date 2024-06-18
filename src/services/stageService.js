
import request from "../utils/request";

const stageService = {
  // getList: (versionId) => request.get(`/version/${versionId}`),
  create: (data) => request.post('/task/stage', data),
  update: (data) => request.put('/task/stage', data),
  updateOrder: (stageId, orderNumber, taskId) => request.patch(`/task/${taskId}/stage/${stageId}/${orderNumber}`),
  delete: (stageId, taskId) => request.delete(`/task/${taskId}/stage/${stageId}`)
}

export default stageService


