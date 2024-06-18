import request from "../utils/request";

const standupService = {
  getList: (params) => request.get("/standup", { params }),
};

export default standupService;
