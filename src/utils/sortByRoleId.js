export const sortByRoleId = (a, b) => {
  if (a?.role_id < b?.role_id) return -1;
  if (a?.role_id > b?.role_id) return 1;
  return 0;
};
