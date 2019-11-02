const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  groupsConst: state => state.user.groups,
  userRolesConst: state => state.user.userRoles,
  adminRolesConst: state => state.user.adminRoles

}
export default getters
