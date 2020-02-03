import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import VueLazyload from 'vue-lazyload'
import '@/styles/index.scss' // global css

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

import App from './App'
import store from './store'
import router from './router'
import imageError from './assets/img-error.png'
import imageLoading from './assets/loading.gif'
import ElTreeGrid from 'element-tree-grid'
import '@/icons' // icon
import '@/permission' // permission control
import moment from 'moment'

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import {
  mockXHR
} from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// use moment
Vue.prototype.$moment = moment

// use ElementUI
Vue.use(ElementUI)
Vue.component(ElTreeGrid.name, ElTreeGrid)

// user Vuelazy.oad
// Vue.use(VueLazyload)

// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: imageLoading,
  attempt: 1
})

// user preview
Vue.use(preview)

Vue.config.productionTip = false

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
