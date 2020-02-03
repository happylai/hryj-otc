import {
  login,
  logout,
  getInfo
} from '@/api/user'
import { get_system_const } from '@/api/admin'

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
  principal: {},
  roles: [],
  userInfo: undefined,
  groups: [],
  adminRoles: [],
  userRoles: [],
  route: [],
  authorities: []
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
    state.principal = userInfo.principal
    state.userInfo = userInfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_AUTH: (state, authorities) => {
    state.authorities = authorities
  },

  SET_SYSTEM_CONST: (state, data) => {
    state.groups = data.groups
    state.adminRoles = data.adminRoles
    state.userRoles = data.userRoles
  }
}

const actions = {
  login({
    commit, dispatch
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
        commit('SET_USERINFO', data.data)
        console.log('logindata', data)
        const authorities = data.data.authorities
        commit('SET_AUTH', authorities)

        setToken(headers['x-auth-token'])
        // await get_system_const().then(res => {
        //   console.log(res)
        //   commit('SET_SYSTEM_CONST', res.data)
        // })
        await dispatch('getSystemConfig')
        console.log('data', data)
        resolve()
      }).catch(err => {
        console.log('err', err)
        reject(err)
      })
    })
  },

  // get user info
  async getInfo({ commit, state }) {
    return new Promise(async(resolve, reject) => {
      console.log('state', state)
      const role = state.userInfo ? state.userInfo.principal.roleList : ['ROLE_USER']

      const data = {
        roles: role
      }

      // const groupName= await get_combo().then(res=>{if(res.code===0){
      //   return res.data
      // }})
      commit('SET_ROLES', 'default')
      // commit('SET_GROUPNAME',groupName)
      console.log('setRoles', role)
      resolve(data)
    })
  },

  async getSystemConfig({ commit, state }) {
    return new Promise(async(resolve, reject) => {
      await get_system_const().then(res => {
        console.log(res)
        commit('SET_SYSTEM_CONST', res.data)
        resolve(res.data)
      })
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
