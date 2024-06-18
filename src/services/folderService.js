import request from "../utils/request";

const folderService = {
  getById: (data) => request.post(`/folder`, data),
};

export default folderService;
