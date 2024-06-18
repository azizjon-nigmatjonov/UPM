


import request from "../utils/request";

const phaseService = {
  getList: (params) => request.get(`/phase`, { params } ),
  getById: (id, params) => request.get(`/phase/${id}`, { params }),
  create: (data) => request.post('/phase', data),
  update: (data) => request.put('/phase', data),
  updateOrder: (id, orderNumber) => request.patch(`/phase/${id}/${orderNumber}`),
  delete: (id) => request.delete(`/phase/${id}`)
}

export default phaseService


