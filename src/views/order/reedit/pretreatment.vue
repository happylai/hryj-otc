<template>
  <div class="">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.query" placeholder="B端UID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.query" placeholder="站内订单号" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.query" placeholder="B端订单号" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.query" placeholder="广告ID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.query" placeholder="交易总价最高" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.query" placeholder="交易总价最低" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-select v-model="fliterQuery.payType" placeholder="广告ID" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.type" placeholder="交易类型" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in CounterParty" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.status" placeholder="订单状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in OrderStatus" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="fliterQuery.creatDate"
        class="filter-item"
        type="daterange"
        range-separator="至"
        start-placeholder="创建开始日期"
        end-placeholder="结束日期"
      />

      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        创建预处理
      </el-button>
    </div>
    <listtable style="width:100%" />
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

  </div>
</template>

<script>
import tip from '@/components/Tip'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import { order_list, order_detail, order_cancel, order_confirm } from '@/api/order'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, PayType, OrderStatus, CounterParty } from '@/utils/enumeration'
import filter from './compontents/filter'
import listtable from './compontents/table'

export default {
  name: 'Tab',
  components: { pagination, tip, listtable },
  directives: { waves },
  data() {
    return {
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
        query: undefined,
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
      editData: {}
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
    handleTabClick(tab, event) {
      console.log('tab', tab)
      this.meta.current = 1
      this.activeType = tab.name
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
      order_list(meta || this.meta, data || { isMatch: this.activeType === '2' }).then(res => {
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
        isMatch: this.activeType === '2',
        type: fliterQuery.type,
        payType: fliterQuery.payType,
        query: fliterQuery.query,
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

      this.getList(meta, data)
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
    orderAction(orderId, ispass) {
      const api = ispass ? order_confirm : order_cancel
      api({ orderId: orderId }).then(res => {
        if (res.code === 0) {
          this.$message.succese('操作成功')
          this.handleFilter()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.$message.error(err.message || '操作失败')
      })
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .appealImage{
    height: 40px;
    max-width: 100px;
  }
</style>
