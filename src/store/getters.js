const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user,
  roles: state => state.user.roles,
  route: state => state.user.route,
  authorities: state => state.user.authorities,
  permission_routes: state => state.permission.routes,
  groupsConst: state => state.user.groups,
  userRolesConst: state => state.user.userRoles,
  adminRolesConst: state => state.user.adminRoles,
  searchedChatlist(state) {
    const sessions = state.chat.chatlist.filter(sessions => sessions.user.name.includes(state.searchText))
    return sessions
  },
  // 筛选出含有搜索值的好友列表
  searchedFriendlist(state) {
    const friends = state.chat.friendlist.filter(friends => friends.remark.includes(state.searchText))
    return friends
  },
  // 通过当前选择是哪个对话匹配相应的对话
  selectedChat(state) {
    const session = state.chat.chatlist.find(session => session.id === state.chat.selectId)
    return session
  },
  // 通过当前选择是哪个好友匹配相应的好友
  selectedFriend(state) {
    const friend = state.chat.friendlist.find(friend => friend.id === state.chat.selectFriendId)
    return friend
  },
  messages(state) {
    const session = state.chat.chatlist.find(session => session.id === state.chat.selectId)
    return session.messages
  }

}
export default getters
