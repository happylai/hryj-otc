import {
  login,
  logout,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter,
  asyncRoutes,
  constantRoutes
} from '@/router'
import router from '@/router'
import {
  deepClone
} from '@/utils/index.js'

const routes = deepClone([...constantRoutes, ...asyncRoutes])
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  userInfo: undefined
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.userInfo = userInfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password,
      captcha
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password,
        captcha: captcha
      }).then(async response => {
        console.log('user login', response.headers['x-auth-token'])
        const {
          data,
          headers
        } = response
        commit('SET_TOKEN', headers['x-auth-token'])
        commit('SET_USERINFO', data.data.data)
        setToken(headers['x-auth-token'])
        // const roles = data.data.data.principal.roleList
        // generate accessible routes map based on rolesroleList
        // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

        // dynamically add accessible routes
        //         router.addRoutes(accessRoutes)
        console.log('data', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      console.log('state', state)
      const role = state.userInfo ? state.userInfo.principal.roleList : ['ROLE_USER']
      const data = {
        roles: role
      }
      commit('SET_ROLES', role)
      console.log('setRoles', role)
      resolve(data)
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])

      removeToken()
      resetRouter()
      resolve()
      // logout(state.token).then(() => {
      //   commit('SET_TOKEN', '')
      //   removeToken()
      //   resetRouter()
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({
    commit,
    dispatch
  }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const {
        roles
      } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, {
        root: true
      })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
