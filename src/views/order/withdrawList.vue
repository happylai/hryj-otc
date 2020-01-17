<template>
  <div class="tab-container">

    <el-tabs v-model="activeType" @tab-click="handleTabClick">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key" />
    </el-tabs>
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.uuid" placeholder="B端UID" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-select v-model="fliterQuery.payType" placeholder="支付方式" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-input v-model="fliterQuery.realName" placeholder="收款人" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-input v-model="fliterQuery.accountNo" placeholder="收款账号" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-date-picker
        v-model="fliterQuery.date"
        type="daterange"
        range-separator="至"
        start-placeholder="申请开始日期"
        end-placeholder="申请结束日期"
        class="filter-item"
      />

      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="200px" align="center" label="B端UID">
        <template slot-scope="scope">
          <span>{{ scope.row.uuid }}</span>
        </template>
      </el-table-column>
      <el-table-column

        align="center"
        label="提现申请时间"
        min-width="140"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="提现总金额">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="80px" label="收款方式">
        <template slot-scope="scope">
          <span>{{ scope.row.payType|payTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="left" label="收款范围">
        <template slot-scope="scope">
          <span>{{ scope.row.payTypeRange }}</span>
        </template>

      </el-table-column>

      <el-table-column align="center" label="真实姓名" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="收款账号">
        <template slot-scope="scope">
          <span>{{ scope.row.accountNo }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="开户行 | 支行">
        <template slot-scope="scope">
          <span>{{ scope.row.bank }} {{ scope.row.bankBranch }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已成交" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.status===3?scope.row.amount:0 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="未成交" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.status!==3?scope.row.amount:0 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.status|WithdrawStatusName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="操作" min-width="220">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status===0" type="danger" :loading="actionLoading" :disabled="actionLoading" size="small" @click="orderAction(scope.row,1)">取消委托</el-button>
          <el-button v-if="scope.row.status>0" type="primary" :loading="actionLoading" :disabled="actionLoading" size="small" @click="showOrderDetail(scope.row)">查看详情</el-button>
          <!-- <el-button v-if="scope.row.status===2" type="success" :loading="actionLoading" :disabled="actionLoading" size="small" @click="orderAction(scope.row,0)">确认收款</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

    <el-dialog :visible.sync="dialogVisible" title="订单详情" width="800px">
      <h3>订单信息</h3>
      <div v-loading="detailLoading">
        <el-row :gutter="20" class="">
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 订单ID:{{ editData.orderB.uuid }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 卖家:{{ editData.orderB.seller }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 买家:{{ editData.orderB.buyer }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 所属广告：{{ editData.orderB.advertiseUuid }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 交易数量(PQC)：{{ editData.orderB.amount }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 交易单价：{{ editData.orderB.price }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 交易金额(CNY)：{{ editData.orderB.legalAmount }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 交易补贴：{{ editData.orderB.dealSubsidy }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 夜间补贴：{{ editData.orderB.nightSubsidy }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 手续费：{{ editData.orderB.fee }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 汇率差：{{ editData.orderB.exchangeMistake }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 创建时间:{{ editData.orderB.createTime }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 审核时间：{{ editData.orderB.outAuditTime }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 付款时间：{{ editData.orderB.payConfirmTime }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 收款时间：{{ editData.orderB.receiveConfirmTime }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 取消时间：{{ editData.orderB.payCancelTime }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 是否申诉：{{ editData.orderB.isAppealed?'是':'否' }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 提现审核人：{{ editData.orderB.isOut?'是':'否' }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 提现审核人：{{ editData.orderB.outAuditAdmin }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 支付方式:{{ editData.orderB.payType|payTypeName }}</div>
          </el-col>
        </el-row>
        <div>
          <h3>支付信息</h3>
          <div v-if="editData.orderB.payInfo&&editData.orderB.payInfo.account">
            <el-row :gutter="20" class="">
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 收款账号:{{ editData.orderB.payInfo.account }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 付款方式：{{ editData.orderB.payInfo.payType|payTypeName }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 真实姓名：{{ editData.orderB.real }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 支付昵称:{{ editData.orderB.payInfo.nick }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 收款地区:{{ editData.orderB.payInfo.area }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 开户银行:{{ editData.orderB.payInfo.bank }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 开户支行:{{ editData.orderB.payInfo.bankBranch }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 二维码:</div>
                <div>
                  <img v-if="editData.orderB.paymentUrlOne" v-lazy="editData.orderB.paymentUrlOne" class="DetailvoucherImage" :preview="`${editData.id}withdarw011`" @click="dialogVisible=false">
                  <span v-else>无</span>
                  <img v-if="editData.orderB.paymentUrlTwo" v-lazy="editData.orderB.paymentUrlTwo" class="DetailvoucherImage" :preview="`${editData.id}withdarw011`" @click="dialogVisible=false">
                  <img v-if="editData.orderB.paymentUrlThree" v-lazy="editData.orderB.paymentUrlThree" class="DetailvoucherImage" :preview="`${editData.id}withdarw011`" @click="dialogVisible=false">
                </div>
              </el-col>

            </el-row>

          </div>
          <span v-else>无</span>

        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button v-if="editData.status===0" type="primary" :loading="actionLoading" :disabled="actionLoading" size="small" @click="orderAction(editData,1)">取消委托</el-button> -->
        <el-button v-if="editData.status>0" type="primary" :loading="actionLoading" :disabled="actionLoading" size="small" @click="showOrderDetail(editData)">查看详情</el-button>
        <!-- <el-button v-if="editData.status===2" type="success" :loading="actionLoading" :disabled="actionLoading" size="small" @click="orderAction(editData,0)">确认收款</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tip from '@/components/Tip'
// import { ImageUrl } from '@/utils/contanst'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import { withdraw_list, close_withdraw } from '@/api/order'
import { order_confirm, order_info } from '@/api/order'
import { uploadImage } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { PayType, WithdrawType } from '@/utils/enumeration'
export default {
  name: 'Tab',
  components: { pagination, tip },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '当前提现委托', key: '0' },
        { label: '历史提现委托', key: '1' }
      ],
      activeType: '0',

      PayType,
      WithdrawType,
      fliterQuery: {
        uuid: undefined,
        accountNo: undefined,
        payType: undefined,
        realName: undefined,
        date: undefined
      },
      type: undefined,
      meta: {
        current: 1,
        size: 10
      },
      loading: false,
      list: [],
      paginationMeta: {
        total: 10,
        pages: 1
      },
      editData: {},
      dialogVisible: false,
      editData: {
        orderB: {}
      },
      appleayImage: [],
      proofs: [],
      reason: undefined,
      actionLoading: false,
      dialogVisible: false,
      detailLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'

    ])
  },
  watch: {

  },

  mounted() {
    this.getList()
  },
  methods: {
    handleTabClick(tab, event) {
      console.log('tab', tab)
      this.meta.current = 1
      const fliterQuery = {
        payType: undefined,
        query: undefined,
        status: undefined,
        creatDate: undefined
      }
      this.fliterQuery = fliterQuery
      this.getList()
    },
    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList()
    },
    getList(meta, data) {
      this.listLoading = true
      withdraw_list(meta || this.meta, data || { ...this.fliterQuery, type: this.activeType }).then(res => {
        console.log('res', res)
        this.listLoading = false

        if (res.code === 0) {
          this.list = res.data.records
        }
      })
    },
    handleFilter() {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        ...fliterQuery,
        date: undefined,
        type: this.activeType
      }
      if (fliterQuery.date) {
        data.createStart = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.createEnd = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
    },
    orderAction(data, type) {
      const apiList = [order_confirm, close_withdraw]
      console.log('data', data, type)
      this.actionLoading = true
      apiList[type](type === 1 ? { withdrawId: data.withdrawApplyId } : { isPay: false, orderId: data.orderId }).then(res => {
        this.actionLoading = false
        if (res.code === 0) {
          this.$message({ type: 'success', message: res.message || '操作成功' })
          this.handleFilter()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch((res) => {
        this.actionLoading = false
        this.$message.error(res.message || '操作失败')
      })
    },
    showOrderDetail(data) {
      this.dialogVisible = true
      this.getOrderInfo(data.orderId)
    },
    getOrderInfo(id) {
      this.detailLoading = true
      order_info({ orderId: id }).then(res => {
        this.detailLoading = false
        if (res.code === 0) {
          this.editData = res.data
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch((res) => {
        this.detailLoading = false
        this.$message.error(res.message || '操作失败')
      })
    }

  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .el-upload-dragger {
    min-width: 200px;
    height: 180px;
  }
  .filter-item{
    margin:4px 0;
  }
  .section-title{
  height: 60px;
  line-height: 60px;
  font-size: 24px;
  margin-right: 12px;
  font-weight: bold;
}
.orderInfoItem{
  margin:8px 4px;
}
</style>
