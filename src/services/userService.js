
import requestAuth from "../utils/requestAuth"

const userService = {
  getList: (params) => requestAuth.get(`/user`, { params }),
  getById: (id, params) => requestAuth.get(`/user/${id}`, { params }),
  create: (data) => requestAuth.post('/user', data),
  update: (data) => requestAuth.put('/user', data),
  delete: (id) => requestAuth.delete(`/user/${id}`),
  patchUserActivation: (userId, active) => requestAuth.patch(`/user/${userId}/active/${active}`)
}

export default userService


