<template>
  <div class="container-tip"><i class="el-icon-warning color-primary" s /> {{ miainTip }}
    <div>
      <el-link type="info" :underline="false">{{ secondTip }}</el-link>
      <el-link v-if="showContact" type="primary">Towards <i class="el-icon-chat-dot-round" /></el-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SvgIcon',
  props: {
    miainTip: {
      type: String,
      default: '处理异常订单正确姿势：1.查看订单详情；2.核实收付款是否完成；3.核查交易提成是否收取；4.核查系统补贴、返利是否发放。'
    },
    secondTip: {
      type: String,
      default: '温馨提示：若遇其他非上述情况请及时联系管理员：'
    },
    showContact: {
      type: Boolean,
      default: true
    }
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
