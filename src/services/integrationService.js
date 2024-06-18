

import requestAuth from "../utils/requestAuth"

const integrationService = {
  getList: (params) => requestAuth.get('/integration', { params }),
  getById: (id, params) => requestAuth.get(`/integration/${id}`, { params }),
  create: (data) => requestAuth.post('/integration', data),
  update: (data) => requestAuth.put('/integration', data),
  delete: (id) => requestAuth.delete(`/integration/${id}`),
  getSessionsList: (id, params) => requestAuth.get(`/integration/${id}/session`, { params }),
  createNewSession: (id, data) => requestAuth.post(`/integration/${id}/session`, data),
  deleteSession: (integrationId, sessionId) => requestAuth.delete(`/integration/${integrationId}/session/${sessionId}`),
  getSessionToken: (integrationId, sessionId) => requestAuth.get(`/integration/${integrationId}/session/${sessionId}`)
}

export default integrationService