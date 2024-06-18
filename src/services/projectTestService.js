import request from "../utils/request";

const projectTestService = {
  getList: (params) => request.get(`/test`, { params }),
  getById: (id, params) => request.get(`/test/${id}`, { params }),
  create: (data) => request.post("/protected/test", data),
  update: (data) => request.put("/test", data),
  updateStatus: (data) => request.patch("/test", data),
  delete: (id) => request.delete(`/test/${id}`),

  createComment: (data) => request.post("/test/comment", data),
  createFile: (data) => request.post("/test/file", data),
  deleteFile: (data) => request.delete(`/test/file`, { data }),
  updateTestCase: (data) => request.put("/protected/test-case", data),
  testRestart: (data) => request.post("/protected/test-restart", data),
};

export default projectTestService;
