import request from "../utils/request";

const currencyService = {
  getList: (params) =>
    request.get(`/currency`, { params }),
};

export default currencyService;
