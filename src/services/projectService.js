import request from "../utils/request"

const projectService = {
  getList: (params) => request.get(`/project`, { params }),
  getProtectedList: (params) => request.get(`/protected/project`, { params }),
  getById: (id, params) => request.get(`/project/${id}`, { params }),
  create: (data) => request.post("/project", data),
  update: (data) => request.put("/project", data),
  updateOrder: (projectId, orderNumber) =>
    request.patch(`/project/${projectId}/${orderNumber}`),
  updateActive: (projectId, active) =>
    request.put(`/project/${projectId}/${active}`),
  delete: (id) => request.delete(`/project/${id}`),
  getReportByStatus: (projectId, versionId) =>
    request.get(`/project/${projectId}/${versionId}/report`),
  getReportBySprints: (projectId, params) =>
    request.get(`/sprint/sprint_dashboard_report/${projectId}`, params),
  getProjectCount: (params) => request.get("/project/count", params),
  getProjectStandup: (projectId) =>
    request.get(`/project/standup_setup/${projectId}`),
  updateStandup: (data) => request.put("/project/standup_setup", data),
  // PROJECT TYPES
  getProjectTypes: (params) => request.get("/project_type", params),
  updateProjectType: (data) => request.put("/project_type", data),
  createProjectType: (data) => request.post("/project_type", data),
  deleteProjectType: (id) => request.delete(`/project_type/${id}`),
}

export default projectService
