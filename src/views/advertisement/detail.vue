<template>
  <div class="tab-container">
    <el-link v-if="autoOrdering" :underline="false" type="success">自动接单中...</el-link>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">广告详情</span>
        <el-button style="float: right; " type="primary" size="small" :disabled="modals.status===0" @click="handleRemove()">下架</el-button>
      </div>
      <div class="text item">
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>广告ID：{{ modals.uuid }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>交易类型：{{ modals.type|advType }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>交易币种：{{ modals.token }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>法币币种：{{ modals.fiat }}</div></el-col>
        </el-row>
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>金额：{{ modals.amount }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>成交量：{{ modals.successAmount }}</div></el-col>
          <el-col :xs="12" :sm="16" :md="8" :lg="12" :xl="12"><div>支付方式：
            <div v-for="(item,index) in modals.payInfos" :key="`paytype${index}`">
              <span>{{ item.payType|payTypeName }}</span> <span> 昵称：{{ item.nick }}</span> <span v-if="item.PayType!==2"> 地区：{{ item.area }} </span>
            </div>
          </div>
          </el-col>

        </el-row>
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>最小成交额：{{ modals.minLimit }}%</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>最大成交额：{{ modals.maxLimit }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>定价方式：{{ modals.priceType===1&&modals.origin===0?'灵活价格':'固定价格' }}</div></el-col>
          <el-col v-if="modals.origin===1" :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>一口价：{{ modals.price }}</div></el-col>
        </el-row>
      </div>
    </el-card>

    <h2>订单明细</h2>
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.query" placeholder="订单ID/交易人" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.payType" placeholder="支付方式" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.status" placeholder="订单状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in OrderStatus" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>

      <el-date-picker
        v-model="fliterQuery.date"
        class="filter-item"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        align="center"
        label="订单ID"
        width="65"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.orderId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="交易人">
        <template slot-scope="scope">
          <span>{{ scope.row.dealer }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="成交额">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="支付类型">
        <template slot-scope="scope">
          <span>{{ scope.row.payType|payTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="奖励">
        <template slot-scope="scope">
          <span>{{ scope.row.award }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手续费" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.authent }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="交易时间" minwidth="300">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单状态" minwidth="300">
        <template slot-scope="scope">
          <el-link :underline="false" :type="scope.row.status|orderStatusTagName">{{ scope.row.status|orderStatus }}</el-link>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

  </div>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect, OrderStatus, CounterParty, PayType } from '@/utils/enumeration'
import { advertise, down_advertise } from '@/api/advertisement'
import { order_details } from '@/api/order'

export default {
  name: 'Tab',
  components: { pagination },
  directives: { waves },
  data() {
    return {
      UserType,
      PayType,
      OrderStatus,
      CounterParty,
      Authents: [{ id: '',
        mame: '',
        label: '请选择'
      }, ...Authents],
      Groups: [emptySelect, ...Groups],
      fliterQuery: {
        page: 1,
        size: 20,
        date: null,
        query: undefined,
        authent: undefined,
        groupId: undefined,
        status: undefined
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
      id: undefined,
      dialogVisible: false,
      modals: {},
      editData: {},
      newData: {}

    }
  },
  computed: {
    ...mapState({
      adminId: state => state.user.principal.adminId
    })
  },
  mounted() {
    this.id = this.$route.params.id

    this.detail(this.id)
  },
  methods: {

    detail(id) {
      this.listLoading = true
      advertise({ id: id || this.id }).then(res => {
        if (res.code === 0) {
          this.modals = res.data
          this.getList()
        }
        console.log('res')
      })
    },

    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList()
    },
    handleFilter() {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        payType: fliterQuery.payType,
        query: fliterQuery.query,
        status: fliterQuery.status,
        advertiseId: this.id
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        // data.start = '2019-10-16 12:11:11'
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
    },
    getList(meta, data) {
      order_details(meta || this.meta, data || { advertiseId: this.id, userId: this.modals.userId }).then(res => {
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
    },
    handleRemove(id) {
      this.$confirm('是否下架该广告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        down_advertise({ id: this.modals.id }).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message.error(res.message || '操作失败')
          }
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
.filter-item{
  margin-top:5px
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
