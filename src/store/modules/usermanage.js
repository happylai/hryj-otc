import { payType } from '@/api/usermanage'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,asyncRoutes, constantRoutes } from '@/router'
import { deepClone } from '@/utils/index.js'
import { deflateRawSync } from 'zlib'

const routes = deepClone([...constantRoutes, ...asyncRoutes])
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [{
    key: 'admin',
    name: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  }],
  userPayType:[]
}

const mutations = {
  SET_PAYTYPE: (state, data) => {
    state.userPayType = data.records,
    state.userPayTypeMeta={
        pages:data.pages,
        current:data.current,
        size:data.size,
        total:data.total
    }
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password,captcha } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password,captcha:captcha }).then(response => {
        console.log("user login",response.headers['x-auth-token'])
        const { data,headers } = response
        commit('SET_TOKEN', headers['x-auth-token'])
        setToken(headers['x-auth-token'])
        commit('SET_ROLES', [{
          key: 'admin',
          name: 'admin',
          description: 'Super Administrator. Have access to view all pages.',
          routes: routes
        }])

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user payType list
  payType({ commit, state }) {
    return new Promise((resolve, reject) => {
    payType().then(response => {
        const { data } = response
        console.log("paytype",data)

        // const { name, avatar } = data

        commit('SET_PAYTYPE', data)
        // commit('SET_AVATAR', avatar)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getAllList({ commit, state }) {
    return new Promise((resolve, reject) => {
      getList().then(response => {
          console.log("order res",response)
        const { data } = response


        commit('set_ALLLIST', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },


  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
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
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      // const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

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

