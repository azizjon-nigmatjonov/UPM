import request from "../utils/request";

const developerService = {
  uptadeDevGiven: (data) => request.put(`/developer`, data),
  postDev: (data) => request.post(`/developer`, data),
  deleteDev: (id) => request.delete(`/developer/${id}`),
};

export default developerService;
