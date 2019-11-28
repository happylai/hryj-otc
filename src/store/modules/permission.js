import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(authorities, route) {
  console.log("authorities",authorities,route)
  // return authorities.some(authority => route.name.includes(authority.authority))
  return authorities.some(authority => authority.authority===route.name)
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param authorities
 */
export function filterAsyncRoutes(routes, authorities) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(authorities, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, authorities)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, authorities) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, authorities)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
