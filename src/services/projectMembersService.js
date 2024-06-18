

import request from "../utils/request";

const projectMembersService = {
  getList: (params) => request.get(`/project-member`, { params } ),
  getById: (id, params) => request.get(`/project-member/${id}`, { params }),
  create: (data) => request.post('/project-member', data),
  update: (data) => request.put('/project-member', data),
  delete: (data) => request.delete(`/project-member`, { data })
}

export default projectMembersService
