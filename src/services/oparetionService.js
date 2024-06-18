import request from "../utils/request";

const operationTypeService = {
  getList: (params) => request.get(`/operation_type`, { params }),
};

export default operationTypeService;
