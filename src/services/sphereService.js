


import request from "../utils/request";

const sphereService = {
  getList: (params) => request.get(`/sphere`, { params } ),
  getById: (id, params) => request.get(`/sphere/${id}`, { params }),
  create: (data) => request.post('/sphere', data),
  update: (data) => request.put('/sphere', data),
  delete: (id) => request.delete(`/sphere/${id}`)
}

export default sphereService


