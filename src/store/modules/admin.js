import {
  admins
} from '@/api/admin'
import qs from 'qs'
const state = {
  admins: undefined,
  meta: {
    current: 1,
    size: 10,
    totle: 1,
    pages: 1,
    query: '',
    roleId: ''
  },
  search: {
    query: '',
    roleId: ''
  }
}

const mutations = {
  SET_ADMINS: (state, data) => {
    state.admins = data.records
    state.meta = {
      ...state.meta,
      current: data.current,
      size: data.size,
      total: data.total,
      pages: data.pages
    }
  },
  SET_META: (state, data) => {
    state.meta = {
      ...state.meta,
      ...data
    }
  }
}

const actions = {
  // get user info
  getAdmins({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      console.log('meta', state.meta)
      const meta = state.meta
      const postMeta = {
        current: meta.current,
        size: meta.size
      }
      const postQuery = {
        query: meta.query,
        roleId: meta.roleId

      }
      admins(postMeta, postQuery)
        .then(response => {
          console.log('admins res', response)
          const {
            data,
            code
          } = response
          if (code === 0) {
            commit('SET_ADMINS', data)
            resolve(data)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // get user info
  changeMeta({
    commit,
    dispatch,
    state
  }, data) {
    return new Promise((resolve, reject) => {
      console.log('new meta', data)
      commit('SET_META', data)
      dispatch('getAdmins')

      //   admins(state.meta, state.search)
      //     .then(response => {
      //       console.log('admins res', response)
      //       const {
      //         data,
      //         code
      //       } = response
      //       if (code === 0) {
      //         resolve(data)
      //       }
      //     })
      //     .catch(error => {
      //       reject(error)
      //     })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
