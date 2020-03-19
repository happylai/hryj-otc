<template>
  <div class="tab-container">
    <statis/>
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.account" clearable placeholder="托底商家ID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.merchant" clearable placeholder="B端ID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.merchantOrder" clearable placeholder="B端订单号" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.orderUid" clearable placeholder="订单编号" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-input v-model="fliterQuery.min" clearable placeholder="交易总价最小" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.max" clearable placeholder="交易总价最大" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-select v-model="fliterQuery.status" placeholder="订单状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
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
      <!-- <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button> -->
    </div>
    <el-table  v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%;font-size:10px">
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

      <el-table-column align="center" width="120px" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.memo }}</span>
        </template>
      </el-table-column>

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

      <el-table-column min-width="80px" align="left" label="支付方式">
        <template slot-scope="scope">

          <el-link v-if="scope.row.payType!==null" :underline="false" @click="handleShowPaymentInfo(scope.row.payInfo)"><i class="el-icon-info" /> {{ scope.row.payType|payTypeName }} </el-link>
          <span v-else>无</span>
        <!-- <span>{{ scope.row.remainAmount }}</span> -->
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="60">
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
          <!-- <el-button class="actionBtn" type="primary" size="small" @click="clickDetail(scope.row)">详情</el-button> -->
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
import { orders as listApi,order_statics } from '../../api/thirdChannle'
import statis from './statis'

export default {
  name: 'Tab',
  components: { pagination,  paymentInfo,statis },
  directives: { waves },
  data() {
    return {
      statusList:[
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
        page: 1,
        size: 10,
        payType: undefined,
        orderUid: undefined,
        merchantOrder: undefined,
        advertiseUid: undefined,
        nick: undefined,
        buyer: undefined,
        seller: undefined,
        status: undefined,
        creatDate: undefined,
        complateDate: undefined
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
      digPayInfo: {}
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
  },
  methods: {
    handleShowPaymentInfo(data) {
      this.digPayInfo = data
      this.showPaymentInfo = true
    },
    handleTabClick(tab, event) {
      console.log('tab', tab)
      this.meta.current = 1
      const fliterQuery = {
        page: 1,
        size: 10,
        payType: undefined,
        query: undefined,
        status: undefined,
        creatDate: undefined,
        complateDate: undefined
      }
      this.fliterQuery = fliterQuery
      this.editData = {
        orderB: {
          payInfo: {}
        },
        orderC: {}
      }
      this.getList()
    },
    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.handleFilter(false)
    },
    getList(meta, data) {
      this.loading = true
      listApi(meta || this.meta, data || { isMatch: this.activeType === '2' }).then(res => {
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
        creatDate:undefined
      }
      if (fliterQuery.creatDate) {
        data.start = this.$moment(fliterQuery.creatDate[0]).format('YYYY-MM-DD HH:mm:ss')
        data.end = this.$moment(fliterQuery.creatDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      resetPage ? meta.current = 1 : null

      this.getList(meta, data)
    },
    handleDownload(resetPage = true) {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        isMatch: this.activeType === '2',
        type: fliterQuery.type,
        orderUid: fliterQuery.orderUid,
        merchantOrder: fliterQuery.merchantOrder,
        advertiseUid: fliterQuery.advertiseUid,
        nick: fliterQuery.nick,
        buyer: fliterQuery.buyer,
        seller: fliterQuery.seller,
        payType: fliterQuery.payType,
        status: fliterQuery.status,
        userId: this.userId
      }
      if (fliterQuery.creatDate) {
        data.createStart = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.createEnd = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      if (fliterQuery.complateDate) {
        data.confirmStart = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.confirmEnd = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      resetPage ? meta.current = 1 : null
      export_excel(meta, data).then(response => {
        this.downloadExcel(response)
      }).catch(() => console.log('export excel error'))
    },
    downloadExcel(response) {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      const fileName = decodeURI(response.headers['content-disposition'].split('=')[1])
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
    clickDetail(data) {
      this.getOrderDetail(data.id)
      this.dialogVisible = true
    },
    getOrderDetail(id) {
      order_detail({ orderId: id }).then(res => {
        if (res.code === 0) {
          this.editData = res.data
        }
      })
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
</style>
