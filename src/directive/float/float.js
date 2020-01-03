import { isInt, isFloat } from '@/utils/index'
import has from 'has-values'

export default {
  inserted: function(el, vDir, vNode) {
    // vDir.value 有指令的参数
    let content
    // 设置输入框的值,触发input事件,改变v-model绑定的值
    const setVal = val => {
      if (vNode.componentInstance) {
        // 如果是自定义组件就触发自定义组件的input事件
        vNode.componentInstance.$emit('input', val)
      } else {
        // 如果是原生组件就触发原生组件的input事件
        el.value = val
        el.dispatchEvent(new Event('input'))
      }
    }
    // 按键弹起=>并限制最大最小
    el.addEventListener('keyup', event => {
      const e = event || window.event
      const num = has(e.target.value) ? Number(e.target.value) : undefined
      console.log('num', e.target.max,)
      if (num) {
        if (num === ~~num) {
          content = num
        } else if ((e.target.value).split('.')[1].length <= 2) {
          content = num
        } else {
          content = num.toFixed(2)
        }
      } else {
        content = undefined
      }
      // content = parseInt(e.target.value * 1)
      // if (!content) {
      //   content = ''
      // }
      setVal(content)
    })
    // 失去焦点=>保留指定位小数
    el.addEventListener('focusout', event => {
    // 此处会在 el-input 的 @change 后执行
      const e = event || window.event
      const num = has(e.target.value) ? Number(e.target.value) : undefined
      const max = has(e.target.max) ? Number(e.target.max) : undefined
      const min = has(e.target.min) ? Number(e.target.min) : undefined
      console.log('min', e.target, e.target.min, min)
      if (num) {
        if (has(max) && num > max) {
          content = max
        } else if (has(min) && num < min) {
          content = min
        } else if (num === ~~num) {
          content = num
        } else if ((e.target.value).split('.')[1].length <= 2) {
          content = num
        } else {
          content = num.toFixed(2)
        }
      } else {
        content = undefined
      }
      setVal(content)
    })
  }
}
