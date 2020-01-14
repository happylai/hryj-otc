import float from './float'

const install = function(Vue) {
  Vue.directive('float', float)
}

if (window.Vue) {
  window['float'] = float
  Vue.use(install); // eslint-disable-line
}

float.install = install
export default float
