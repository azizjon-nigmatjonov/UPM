
import request from "../utils/request";

const versionsService = {
  getList: (params) => request.get('/version', { params }),
  getListInProject: (projectId, params) => request.get('/version', { params: {...params, project_id: projectId} }),
  create: (projectId, title) => request.post('/version', { project_id: projectId, title }),
  delete: (id) => request.delete(`/version/${id}`),
  update: (data) => request.put('/version', data),
  updateOrder: (id, orderNumber) => request.patch(`/version/${id}/${orderNumber}`)
}

export default versionsService