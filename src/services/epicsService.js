
import request from "../utils/request";

const epicsService = {
  getList: (versionId) => request.get(`/version/${versionId}`),
  getbyMainVersoin: (projectId) => request.get(`/version/main-version/${projectId}`),
  create: (data) => request.post('/version/epic', data),
  update: (data) => request.put('/version/epic', data),
  updateOrder: (epicId, orderNumber, versionId) => request.patch(`/version/${versionId}/epic/${epicId}/${orderNumber}`),
  delete: (epicId, versionId) => request.delete(`/version/${versionId}/epic/${epicId}`)
}

export default epicsService