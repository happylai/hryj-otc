<template>
  <el-dialog
    title="支付方式详情"
    :visible.sync="dialogVisible"
    width="600px"
    @close="handleClose"
  >
    <div>
      <el-row :gutter="20" class="rowHeiht">
        <el-col :span="12">
          <div>真实姓名：{{ payInfo.real }}</div>
        </el-col>
        <el-col :span="12">
          <div>支付方式：{{ payInfo.payType|payTypeName }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="rowHeiht">
        <el-col :span="12">
          <div>支付账号：{{ payInfo.account }}</div>
        </el-col>
        <el-col :span="12">
          <div>收款区域：{{ payInfo.area }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="rowHeiht">
        <el-col :span="12">
          <div>账号昵称：{{ payInfo.nick }}</div>
        </el-col>
        <el-col :span="12">
          <div>开户支行：{{ payInfo.bank }} {{ payInfo.bankBranch }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="rowHeiht">
        <el-col :span="12">
          <div>支付二维码：
            <img v-lazy="payInfo.qrCode" preview="chat" class="QrImage"></div>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'SvgIcon',
  props: {
    payInfo: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }

  },
  computed: {

  },
  mounted() {
    setTimeout(() => {
      if (this.payInfo.qrCode) { this.$previewRefresh() }
    }, 1000)
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    }
  }
}
</script>

<style scoped>
.QrImage{
  max-width: 60px;
  max-height: 200px;
}
.rowHeiht{
  margin: 14px 0
}
</style>
