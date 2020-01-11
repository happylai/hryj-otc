<template>
  <div class="">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.merchantUid" placeholder="B端UID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.query" placeholder="站内订单号" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.merchantOrderNo" placeholder="B端订单号" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.advertiseNo" placeholder="广告ID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.min" placeholder="交易总价最高" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.max" placeholder="交易总价最低" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />

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
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-add" @click="showAdd=true">
        创建预处理
      </el-button>
    </div>
    <listtable style="width:100%" :data="list" type="1" />
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />
    <el-dialog :visible.sync="showAdd" title="创建预处理补单">
      <el-form ref="regForm" :model="newOrder" :rules="addRules" class="login-form" label-width="120px" auto-complete="on" label-position="right">
        <el-form-item label="原站内订单编号" class="addUserItem" prop="username">
          <el-input ref="orderNo" v-model="newOrder.orderNo" autocomplete="off" placeholder="请输入原站内订单编号" name="orderNo" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item label="原B端订单编号" class="addUserItem" prop="email">
          <el-input ref="merchantOrderNo" v-model="newOrder.merchantOrderNo" autocomplete="off" placeholder="请输原B端订单编号" name="merchantOrderNo" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>

        <el-form-item label="" class="addUserItem">
          <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleNewOrder">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import tip from '@/components/Tip'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import { reorder_pres as listApi, reorder_detail, pre_odrder_save } from '@/api/order'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, PayType, OrderStatus, CounterParty } from '@/utils/enumeration'
import filter from './compontents/filter'
import listtable from './compontents/table'

export default {
  name: 'Tab',
  components: { pagination, tip, listtable },
  directives: { waves },
  data() {
    const validateOrder = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入原站内订单编号'))
      } else if (value.length < 6) {
        callback(new Error('密码必须大于6位数'))
      } else if (this.regForm.password !== value) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      addRules: {
        orderNo: [{ required: true, trigger: 'blur', validator: validateOrder }]

      },
      CounterParty,
      OrderStatus,
      PayType,
      UserType,
      Authents,
      Groups,

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
      newOrder: {
        orderNo: undefined,
        merchantOrderNo: undefined
      },
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
      editData: {},
      showAdd: false
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

    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.handleFilter(false)
    },
    getList(meta, data) {
      this.loading = true
      listApi(meta || this.meta, data || '').then(res => {
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
        ...this.fliterQuery,
        creatDate: undefined
      }
      if (fliterQuery.creatDate) {
        data.createStart = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.createEnd = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
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
      this.orderDetailLoading = true
      reorder_detail(id).then(res => {
        this.orderDetailLoading = false
        if (res.code === 0) {
          this.editData = res.data
        }
      }).catch(() => {
        this.orderDetailLoading = false
      })
    },
    orderAction(orderId, ispass) {
      const api = ispass ? order_confirm : order_cancel
      api({ orderId: orderId }).then(res => {
        if (res.code === 0) {
          this.$message({ message: res.message || '操作成功', type: 'success' })
          this.handleFilter()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.$message.error(err.message || '操作失败')
      })
    },
    handleNewOrder() {
      pre_odrder_save(this.newOrder).then(res => {
        if (res.code === 0) {
          this.$message({ message: res.message || '操作成功', type: 'success' })
          this.handleFilter()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.$message({ message: '操作成功', type: 'success' })

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
