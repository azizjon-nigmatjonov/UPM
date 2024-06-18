import request from "../utils/request";

const workloadService = {
  getList: (params) => request.get("/workload", { params }),
  getWorkload: (params) => request.get("/workload_one", { params }),
  getWorkloadPlan: (params) => request.get("/workload/plan_fact", { params }),
  getReport: (params) => request.get("/workload/developer-report", { params }),
  updateOrder: (data) => request.put("/priority_history", data),
  createWorkload: (data) => request.post("/workload", data),
  getDownloadExcel: (params) => request.get("/workload/excel", { params }),
  getWorkloadDevelopersList: (params) =>
    request.get("/workload/projects/developer-report", { params }),
};

export default workloadService;
