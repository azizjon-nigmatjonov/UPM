
import request from "../utils/request";

const checklistService = {
  add: (data) => request.post('/subtask/checklist', data),
  update: (data) => request.put('/subtask/checklist', data),
  delete: (subtaskId, checklistId) => request.delete(`/subtask/${subtaskId}/checklist/${checklistId}`)
}

export default checklistService