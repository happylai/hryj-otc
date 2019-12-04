<template>
  <div class="tab-container">
   <el-tabs v-model="activeType" style="margin-top:15px;" @tab-click="handleTabClick">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key" />
      <tip />
      <div class="filter-container" style="margin-bottom: 10px;">
        <el-input v-model="fliterQuery.query" placeholder="订单ID/广告ID/首付款昵称/卖家/卖家" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="fliterQuery.payType" placeholder="支付方式" clearable style="width: 140px" class="filter-item">
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
          start-placeholder="订单完创建开始日期"
          end-placeholder="结束日期"
        />
        <el-date-picker
          v-model="fliterQuery.complateDate"
          class="filter-item"
          type="daterange"
          range-separator="至"
          start-placeholder="交易完成开始日期"
          end-placeholder="结束日期"
        />
        <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
      <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column

          align="center"
          label="订单ID"
          min-width="140"
          element-loading-text="请给我点时间！"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.uuid }}</span>
          </template>
        </el-table-column>

        <el-table-column width="80px" align="center" label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.type|advType }}</span>
          </template>
        </el-table-column>

        <el-table-column width="80px" align="center" label="币种">
          <template slot-scope="scope">
            <span>{{ scope.row.token }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="卖家" min-width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.seller }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="买家" min-width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.buyer }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="80px" label="交易额">
          <template slot-scope="scope">
            <span>{{ scope.row.amount }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="支付方式" width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.payType|payTypeName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="奖励" width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.award }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="手续费" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.fee }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="交易时间" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="状态" width="95">
          <template slot-scope="scope">
            <el-link :underline="false" :type="scope.row.orderStatus|orderStatusTagName">{{ scope.row.orderStatus|orderStatus }}</el-link>
          </template>
        </el-table-column>

        <el-table-column align="center" class-name="status-col" label="操作" width="110">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="clickDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tabs>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />
    <el-dialog :visible.sync="dialogVisible" title="基础信息审核">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">订单ID：</el-col>
        <el-col :span="16">{{ editData.uuid }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">创建时间：</el-col>
        <el-col :span="16">{{ editData.createTime }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">付款时间：</el-col>
        <el-col :span="16">{{ editData.payConfirmTime }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">申诉时间：</el-col>
        <el-col :span="16">{{ editData.appealTime }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">取消时间：</el-col>
        <el-col :span="16">{{ editData.payCancelTime }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">完成时间：</el-col>
        <el-col :span="16">{{ editData.receiveConfirmTime }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">所属广告</el-col>
        <el-col :span="16">{{ editData.advertiseUuid }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">类型：</el-col>
        <el-col :span="16">{{ editData.mobileContact }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">币种：</el-col>
        <el-col :span="16">{{ editData.token }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">买家：</el-col>
        <el-col :span="16">{{ editData.buyer }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">卖家：</el-col>
        <el-col :span="16">{{ editData.seller }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">订单状态：</el-col>
        <el-col :span="16">{{ editData.orderStatus|orderStatus }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">付款状态：</el-col>
        <el-col :span="16">
          <span>{{ editData.isPay?'已付款':'未付款' }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">收款状态：</el-col>
        <el-col :span="16">
          <span>{{ editData.isConfirm?'已收款':'未收款' }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">支付方式：</el-col>
        <el-col :span="16">{{ editData.mobileContact|payTypeNames }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">交易金额：</el-col>
        <el-col :span="16">{{ editData.amount }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">成交额：</el-col>
        <el-col :span="16">{{ editData.legalAmount }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">交易补贴：</el-col>
        <el-col :span="16">{{ editData.orderSubsidy }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">夜间补贴：</el-col>
        <el-col :span="16">{{ editData.nightSubsidy }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">达量补贴：</el-col>
        <el-col :span="16">{{ editData.amountSubsidy }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">订单补贴：</el-col>
        <el-col :span="16">无</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">下级返佣：</el-col>
        <el-col :span="16">无</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">放币时间：</el-col>
        <el-col :span="16">无</el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">确定</el-button>
        <el-button type="info" @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tabPane from './components/TabPane'
import tip from '@/components/Tip'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import { order_list, order_detail } from '@/api/order'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, PayType, OrderStatus, CounterParty } from '@/utils/enumeration'
export default {
  name: 'Tab',
  components: { tabPane, pagination, tip },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '交易所用户订单', key: '1' },
        { label: '站点用户订单', key: '2' }
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
      this.getList()
    },
    getList(meta, data) {
      this.listLoading = true
      this.listLoading = true
      order_list(meta || this.meta, data || { isMatch: this.activeType === '2' }).then(res => {
        console.log('res', res)
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
    },
    handleFilter() {
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
      meta.current = 1
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
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
