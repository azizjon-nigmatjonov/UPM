import request from "../utils/request";

const noteService = {
  getList: (params) => request.get(`/note`, { params }),
  getById: (id, params) => request.get(`/note/${id}`, { params }),
  create: (data) => request.post("/note", data),
  update: (data) => request.put("/note", data),
  delete: (id) => request.delete(`/note/${id}`),
};

export default noteService;
