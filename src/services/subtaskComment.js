
import request from "../utils/request";

const subtaskCommentService = {
  add: (data) => request.post('/subtask/comment', data),
  update: (data) => request.put('/subtask/comment', data),
  delete: (subtaskId, commentId) => request.delete(`/subtask/${subtaskId}/comment/${commentId}`)
}

export default subtaskCommentService