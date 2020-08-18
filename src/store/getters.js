const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  permission_routes: state => state.permission.routes,
  // 新增
  user_id: state => state.user.user_id,
  user_name: state => state.user.user_name,
  user_phone: state => state.user.user_phone,
  user_email: state => state.user.user_email,
  user_major: state => state.user.user_major,
  menus: state => state.user.menus // 存储菜单信息

}
export default getters
