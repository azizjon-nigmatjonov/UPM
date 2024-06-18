

import request from "../utils/request";

const projectMembersGroupService = {
  getList: (params) => request.get(`/project-member-group`, { params } ),
  getById: (id, params) => request.get(`/project-member-group/${id}`, { params }),
  create: (data) => request.post('/project-member-group', data),
  update: (data) => request.put('/project-member-group', data),
  delete: (id) => request.delete(`/project-member-group/${id}`)
}

export default projectMembersGroupService


