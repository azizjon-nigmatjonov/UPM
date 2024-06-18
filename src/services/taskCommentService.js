


import request from "../utils/request";

const taskCommentService = {
  add: (data) => request.post('/task/comment', data),
  update: (data) => request.put('/task/comment', data),
  delete: (subtaskId, commentId) => request.delete(`/task/${subtaskId}/comment/${commentId}`)
}

export default taskCommentService