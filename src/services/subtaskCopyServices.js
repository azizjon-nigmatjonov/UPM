import request from "../utils/request";

const subtaskCopyService = {
  post: (subtaskId, data) => request.post(`/subtask-copy/${subtaskId}`, data),
  delete: (subtaskId) => request.delete(`/subtask/${subtaskId}`),
};

export default subtaskCopyService;
