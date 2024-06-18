import request from "../utils/request";

const departmentService = {
  uptadeDepPlan: (data) => request.put(`/department`, data),
};

export default departmentService;
