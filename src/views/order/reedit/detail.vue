<template>
  <div class="tab-container">
    <el-card v-loading="detailLoading" class="box-card">

      <el-row :gutter="10">
        <el-col :xs="12" :sm="8"><div class="cardItem">B端UID：{{ modals.merchantUid }}</div></el-col>
        <el-col :xs="12" :sm="8"><div class="cardItem">处理人：{{ modals.admin||name }}</div></el-col>
      </el-row>
    </el-card>
    <el-card v-loading="detailLoading" class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">原订单信息：</span>  </div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="8"><div class="cardItem">B端订单编号：{{ modals.merchantOrderNo }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">原订单编号：{{ modals.orderNo }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">广告编号：{{ modals.advertiseNo }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">卖方UID：{{ modals.newSellerUid }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">买方UID：{{ modals.newBuyerUid }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">交易类型：{{ modals.nickName }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">交易单价：{{ modals.newPrice }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">交易数量：{{ modals.newAmount }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">交易总价：{{ modals.newLegalAmount }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">订单状态：<el-link :underline="false" :type="modals.oldStatus|orderStatusTagName">{{ modals.orderStatus|orderStatus }}</el-link> </div></el-col>
        </el-row></div>
    </el-card>
    <el-card v-loading="detailLoading" class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">支付信息：</span>  </div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="8"><div class="cardItem">支付方式：{{ modals.payType|payTypeName }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">支付账号：{{ modals.account }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">真实姓名：{{ modals.realName }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">支付备注：{{ modals.meno }}</div></el-col>
          <el-col :xs="12" :sm="8"><div class="cardItem">支付码：
            <div v-if="modals.qrCode">
              <img v-lazy="modals.qrCode" class="voucherImage" :preview="modals.preId+'withdarw0'">
            </div>
            <span v-else>'无'</span>
          </div>
          </el-col>
        </el-row></div>
    </el-card>
    <el-card v-loading="detailLoading" class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">补单操作：</span>  </div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="8">
            <div class="cardItem">
              <span class="cardItem-title">原订单编号：</span>
              <el-input v-model="newData.oldOrder" placeholder="请输入原订单编号" />
            </div>
          </el-col>
          <el-col :xs="12" :sm="8">
            <div class="cardItem">
              <span class="cardItem-title">卖方UID：</span>
              <el-input v-model="newData.sellerUid" placeholder="请输入原卖方UID" />
            </div>
          </el-col>
          <el-col :xs="12" :sm="8">
            <div class="cardItem">
              <span class="cardItem-title">买方UID：</span>
              <el-input v-model="newData.buyerUid" placeholder="请输入买方UID" />
            </div>
          </el-col>
          <el-col :xs="12" :sm="8">
            <div class="cardItem">
              <span class="cardItem-title">单价（CNY)：</span>
              <el-input v-model="newData.price" placeholder="请输单价" @blur="claLegalAmountByPrice" />
            </div>
          </el-col>
          <el-col :xs="12" :sm="8">
            <div class="cardItem">
              <span class="cardItem-title">交易数量：</span>
              <el-input v-model="newData.newAmount" placeholder="请输入交易数量" @blur="claLegalAmountByAmount" />
            </div>
          </el-col>
          <el-col :xs="12" :sm="8">
            <div class="cardItem">
              <span class="cardItem-title">交易总价（CNY）：</span>
              <el-input v-model="newData.legalAmount" placeholder="请输入交易总价" @blur="claAmount" />
            </div>
          </el-col>

        </el-row></div>
    </el-card>
    <el-button v-if="modals.orderStatus!==5" style="float: right; margin-right:10px " type="primary" @click="vlidateInput">确认补单</el-button>

  </div>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

import { order_details } from '@/api/order'
import float from '@/directive/float' // float Number directive

import { reorder_pres as listApi, pro_order_detail, pre_odrder_save, pre_odrder_confirm } from '@/api/order'

export default {
  name: 'Tab',
  components: { pagination },
  directives: { waves, float },
  data() {
    return {

      id: undefined,
      modals: {},
      newData: {
        'buyerUid': undefined,
        'legalAmount': undefined,
        'newAmount': undefined,
        'oldOrder': undefined,
        'price': undefined,
        'sellerUid': undefined
      },
      saveLoading: false,
      detailLoading: false
    }
  },
  computed: {
    ...mapState({
      adminId: state => state.user.principal.adminId
    }),
    ...mapGetters([
      'groupsConst',
      'userRolesConst',
      'adminRolesConst',
      'name'
    ])
  },

  mounted() {
    this.id = this.$route.params.id

    // this.type = this.$route.meta.type
    this.getOrderDetail(this.id)
  },
  methods: {
    claLegalAmountByPrice() {
      const price = this.newData.price
      if (price) {
        this.newData.legalAmount = this.newData.newAmount * price
      }
    },
    claLegalAmountByAmount() {
      const newAmount = this.newData.newAmount
      if (newAmount) {
        this.newData.legalAmount = this.newData.price * newAmount
      }
    },
    claAmount() {
      const legalAmount = this.newData.legalAmount
      if (legalAmount) {
        this.newData.newAmount = legalAmount / this.newData.price
      }
    },

    getOrderDetail(id) {
      this.orderDetailLoading = true
      pro_order_detail(id || this.id).then(res => {
        this.orderDetailLoading = false
        if (res.code === 0) {
          this.modals = res.data
          this.newData = {
            'buyerUid': res.data.newBuyerUid,
            'legalAmount': res.data.newLegalAmount,
            'newAmount': res.data.newAmount,
            'oldOrder': res.data.orderNo,
            'price': res.data.newPrice,
            'sellerUid': res.data.newSellerUid
          }
        }
      }).catch(() => {
        this.orderDetailLoading = false
      })
    },
    vlidateInput() {
      const d = this.newData
      if (!d.oldOrder) {
        this.$message.error('请输入原订单号')
      } else if (!d.sellerUid) {
        this.$message.error('请输入卖方UID')
      } else if (!d.buyerUid) {
        this.$message.error('请输入买方UID')
      } else if (!d.price) {
        this.$message.error('请输入单价')
      } else if (!d.newAmount) {
        this.$message.error('请输入交易数量')
      } else if (!d.legalAmount) {
        this.$message.error('请输入交易总价')
      } else {
        this.handleConfirm()
      }
    },
    handleConfirm() {
      const postData = {
        ...this.newData,
        newAmount: undefined
      }
      this.saveLoading = true
      pre_odrder_confirm(postData).then(res => {
        this.saveLoading = false
        if (res.code === 0) {
          this.$message({ message: res.message || '操作成功', type: 'success' })
          this.getOrderDetail()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.saveLoading = false
        this.$message.error(err.message || '操作失败')
      })
    }

  }
}
</script>

<style scoped>
.card-info-text{
  margin-right: 10px;
}
.tab-container {
  margin: 30px;
}
.filter-item{
  margin-top:5px
}
.card-title{
  font-weight: bold;
  font-size: 16px
}
.section-title-container{
  margin: 40px 0 20px;
}
.section-title{
  font-size: 24px;
  font-weight: bold;
}
.card-row{
  margin: 40px 0;
}
.marginT20{
  margin-top: 20px
}
.card-item{
  height: 100px;
  margin: 0 20px;
}
.borderR{
  border-right: 1px solid #ccc;

}
.cart-i-t{
  font-size: 14px
}
.cart-i-v{
  height: 60px;
  line-height: 60px;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  text-indent: -30px;
}
.userRow {
  min-height: 20px;
  margin: 10px 0;
}
.supplyRow{
  margin:10px 0;
  min-height: 20px;
}
.supplyType{
  line-height: 40px;
  font-size: 16px;
  font-weight: bold;
}
.text_red{
  color: #f56c6c
}
.box-card{
  margin-bottom: 20px;
}
.cardItem{
  margin:10px ;
}
.voucherImage{
  max-width: 80px;
  max-height: 120px;
}
.cardItem input{
  width: 100px;
}
</style>
