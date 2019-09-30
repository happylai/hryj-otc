import { getList } from '@/api/order'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  allList:undefined,
  allMeta:{
      current:1,
      pages:1,
      size:10,
      total:0,
  }
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
  set_ALLLIST:(state,data)=>{
      let allmeta={
        current:data.current,
        pages:data.pages,
        size:data.size,
        total:data.total,
      }
      state.allList=data.records;
      state.allMeta=allmeta;
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
        resolve()
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

