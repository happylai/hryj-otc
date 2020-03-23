<template>
  <div class="tab-container">
    <!-- <statis /> -->
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.uuid" clearable placeholder="托底商家ID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.merchant" clearable placeholder="B端ID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.merchantOrder" clearable placeholder="B端订单号" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.status" placeholder="订单状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-input v-model="fliterQuery.orderUid" clearable placeholder="订单编号" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.min" clearable placeholder="交易总价最小" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.max" clearable placeholder="交易总价最大" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-date-picker
        v-model="fliterQuery.creatDate"
        class="filter-item"
        type="daterange"
        range-separator="至"
        start-placeholder="订单完创建开始日期"
        end-placeholder="结束日期"
      />

      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

    </div>
    <el-card class="box-card marginT20 marginB20">
      <div class="text item">
        <el-row :gutter="10">
          <el-col :xs="6" :sm="6" :md="6" :lg="5" :xl="5">
            <div class="card-item borderR">
              <div class="cart-i-t">托底出售交易量汇总 </div>
              <div class="cart-i-v">{{ modals.dealAmount||'-' }}</div>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="5" :xl="5">
            <div class="card-item borderR">
              <div class="cart-i-t">托底出售完成交易量汇总</div>
              <div class="cart-i-v">{{ modals.finishAmount||'-' }}</div>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="4" :xl="4">
            <div class="card-item borderR">
              <div class="cart-i-t">托底订单数</div>
              <div class="cart-i-v">{{ modals.dealCount||'-' }}</div>
            </div></el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="5" :xl="5">
            <div class="card-item borderR">
              <div class="cart-i-t">托底完成订单数</div>
              <div class="cart-i-v">{{ modals.finishCount||'-' }}</div>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="5" :xl="5">
            <div class="card-item ">
              <div class="cart-i-t">托底订单完成率</div>
              <div class="cart-i-v">{{ modals.percent||'-' }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%;font-size:10px">
      <el-table-column

        align="center"
        label="B端订单号"
        min-width="140"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.merchantOrder }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="B端ID">
        <template slot-scope="scope">
          <span>{{ scope.row.buyerUid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="托底商家ID">
        <template slot-scope="scope">
          <span>{{ scope.row.sellerUid }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="站内订单编号" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.orderUid }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="站内商家ID" min-width="100">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" width="120px" label="交易总金额（cny)">
        <template slot-scope="scope">
          <span>{{ scope.row.legalAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="交易总资产（pqc）">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>

        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="left" label="支付方式">
        <template slot-scope="scope">

          <el-link v-if="scope.row.payType!==null" :underline="false"><i class="el-icon-info" /> {{ scope.row.payType|payTypeName }} </el-link>
          <span v-else>无</span>
        <!-- <span>{{ scope.row.remainAmount }}</span> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          <el-link :underline="false" :type="scope.row.orderStatus|orderStatusTagName">{{ scope.row.orderStatus|orderStatus }}</el-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单创建时间" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单完成时间" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.receiveConfirmTime||'无' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="操作" min-width="210">
        <template slot-scope="scope">
          <el-button class="actionBtn" :disabled="scope.row.orderStatus===2||scope.row.orderStatus===5||scope.row.orderStatus===6" type="danger" size="small" @click="orderAction(scope.row.id,0,activeType==='1'?'强制取消':scope.row.isOut?'取消委托':'强制取消')">{{ activeType==='1'?'强制取消':scope.row.isOut?'取消委托':'强制取消' }}</el-button>
          <el-button class="actionBtn" :disabled="scope.row.orderStatus===2||scope.row.orderStatus===5||scope.row.orderStatus===6" type="success" size="small" @click="orderAction(scope.row.id,1,'强制完成')">强制完成</el-button>
          <el-button v-if="activeType==='2'&&scope.row.idOut" class="actionBtn" :disabled="scope.row.orderStatus===2||scope.row.orderStatus===5||scope.row.orderStatus===6" type="success" size="small" @click="orderAction(scope.row.id,2,'重新匹配')">重新匹配</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />
    <paymentInfo :dialog-visible="showPaymentInfo" :pay-info="digPayInfo" @handleClose="showPaymentInfo=false" />

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import paymentInfo from '@/components/PaymentInfo'
import { order_list, order_detail, order_cancel, order_confirm, pro_odrder_rematch, export_excel } from '@/api/order'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, PayType, OrderStatus, CounterParty } from '@/utils/enumeration'
// import { exportExcel } from '../../api/order'
import { orders as listApi, order_statics } from '../../api/thirdChannle'

import statis from './statis'

export default {
  name: 'Tab',
  components: { pagination, paymentInfo, statis },
  directives: { waves },
  data() {
    return {
      statusList: [
        {
          name: 'UN_PAYED',
          id: 0,
          label: '进行中',
          tagType: 'warning'
        },
        {
          name: 'CANCELED',
          id: 2,
          label: '取消',
          tagType: 'info'

        },
        {
          name: 'COMPLETED',
          id: 5,
          label: '完成',
          tagType: 'success'
        },
        {
          name: 'PAY_TIMEOUT',
          id: 7,
          label: '支付超时',
          tagType: 'danger'
        }
      ],
      tabMapOptions: [
        { label: '站内订单', key: '1' },
        { label: 'To B订单', key: '2' }
      ],
      CounterParty,
      OrderStatus,
      PayType,
      UserType,
      Authents,
      Groups,
      activeType: '1',
      isMatch: false,
      createdTimes: 0,
      fliterQuery: {
        uuid: undefined,
        status: undefined,
        orderUid: undefined,
        merchantOrder: undefined,
        merchant: undefined,
        orderUid: undefined,
        min: undefined,
        max: undefined
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
      dialogVisible: false,
      editData: {
        orderB: {
          payInfo: {}
        },
        orderC: {}
      },
      showPaymentInfo: false,
      digPayInfo: {},
      modals: {}
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  computed: {
    ...mapState({
      allList: state => state.order.allList,
      allListMeta: state => state.order.allMeta
    })
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  mounted() {
    this.getList()
    this.detail()
  },
  methods: {
    detail() {
      this.listLoading = true
      const fliterQuery = this.fliterQuery
      const data = {
        uuid: this.fliterQuery.uuid
      }
      if (fliterQuery.creatDate) {
        data.start = this.$moment(fliterQuery.creatDate[0]).format('YYYY-MM-DD HH:mm:ss')
        data.end = this.$moment(fliterQuery.creatDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      order_statics(data).then(res => {
        console.log('订单统计')
        if (res.code === 0) {
          this.modals = res.data
        }
      })
    },

    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.handleFilter(false)
    },
    getList(meta, data) {
      this.loading = true
      listApi(meta || this.meta, data).then(res => {
        console.log('res', res)
        this.loading = false
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
    },
    handleFilter(resetPage = true) {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        ...fliterQuery,
        creatDate: undefined
      }
      if (fliterQuery.creatDate) {
        data.start = this.$moment(fliterQuery.creatDate[0]).format('YYYY-MM-DD HH:mm:ss')
        data.end = this.$moment(fliterQuery.creatDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      resetPage ? meta.current = 1 : null

      this.getList(meta, data)
      this.detail()
    },

    orderAction(orderId, type, tipText) {
      const apiList = [order_cancel, order_confirm, pro_odrder_rematch]
      this.$confirm(`是否${tipText}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((val) => {
        apiList[type]({ orderId: orderId }).then(res => {
          if (res.code === 0) {
            this.$message({ message: res.message || '操作成功', type: 'success' })
            this.handleFilter()
          } else {
            this.$message.error(res.message || '操作失败')
          }
        }).catch(err => {
          this.$message.error(err.message || '操作失败')
        })
      })
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .marginB20{
    margin-bottom: 20px;
  }
  .DetailvoucherImage, .appealImage{
    height: 40px;
    max-width: 100px;
  }
  .actionBtn{
    font-size: 10px;
    margin: 4px;
  }
  .orderInfoItem{
    margin:8px 4px;
  }
  .card-title{
  font-weight: bold;
  font-size: 16px
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
</style>
