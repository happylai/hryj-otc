<template>
  <div class="tab-container">
    <tip />

    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="listQuery.keywords" placeholder="订单ID/广告ID/买家/卖家/备注" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="订单类型" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="支付方式" clearable class="filter-item" style="width: 140px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" placeholder="订单状态" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in OrderStatus" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <el-table :data="data" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        align="center"
        label="订单ID"
        width="65"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="所属广告">
        <template slot-scope="scope">
          <span>{{ scope.row.advertiseId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.token }}</span>
        </template>
      </el-table-column>

      <el-table-column width="70px" align="center" label="币种">
        <template slot-scope="scope">
          <span>{{ scope.row.token }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="交易额">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="卖家" width="55">
        <template slot-scope="scope">
          <span>{{ scope.row.seller }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付方式" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.payType|paymentStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手续费" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.fee }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="交易时间" minwidth="300">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.orderStatus|orderStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="操作" width="110">
        <template slot-scope="{row}">
          <el-button type="primary" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="allListMeta.total>0" :total="allListMeta.total" :page.sync="allListMeta.pages" :limit.sync="allListMeta.size" @pagination="getList" />

    <el-dialog :visible.sync="dialogPvVisible" title="订单详情">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tip from '@/components/Tip'

import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { OrderStatus, PayType } from '@/utils/enumeration'

export default {
  name: 'Tab',
  components: { tip },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '交易所用户订单', key: 'all' },
        { label: '站点用户订单', key: 'site' }
      ],
      activeName: 'all',
      createdTimes: 0,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        keywords: undefined,
        orderType: undefined,
        paymentType: undefined,
        orderStatus: undefined,
        dialogPvVisible: true
        // orderStatus:OrderStatus,
        // payType:PayType
      }
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
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    getList() {
      this.listLoading = true
      this.$store.dispatch('order/getAllList')
      // 	fetchList(this.listQuery).then(response => {
      // 		this.list = response.data.items
      // 		this.total = response.data.total

      // 		// Just to simulate the time of the request
      // 		setTimeout(() => {
      // 			this.listLoading = false
      // 		}, 1.5 * 1000)
      // })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
