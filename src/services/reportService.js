import request from "../utils/request";

const reportService = {
  post: (data) => request.post(`/report/standup`, data),
  postFinance: (data) =>
    request.post(
      `/report/finance?from_date=${data.from_date}&to_date=${data.to_date}`
    ),
};

export default reportService;
