import request from "../utils/request";

const sprintStepsService = {
  getList: (params) => request.get(`/project_sprint_step`, { params } ),
  getById: (id, params) => request.get(`/project_sprint_step/${id}`, { params }),
  create: (data) => request.post('/project_sprint_step', data),
  update: (data) => request.put('/project_sprint_step', data),
  delete: (id) => request.delete(`/project_sprint_step/${id}`),
}

export default sprintStepsService


