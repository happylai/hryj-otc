<template>
  <div>
    <div class="merchant-detail-label">B端详细数据</div>
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="filterQuery.userUid" clearable placeholder="B端UID" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="filterQuery.payChannel" clearable placeholder="支付通道" yle="width: 140px" class="filter-item">
        <el-option v-for="item in PayChannel" :key="item.id" :disabled="item.id===3||item.id===4" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="filterQuery.schema" clearable placeholder="支付模式" style="width: 140px" class="filter-item">
        <el-option v-for="item in PaySchema" :key="item.id" :disabled="(filterQuery.payChannel!==undefined&&filterQuery.payChannel!=='')&&filterQuery.payChannel!==item.parentId" :label="item.label" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="filterQuery.date"
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

    <el-table v-loading="listLoading" stripe :data="list" border fit highlight-current-row style="width: 100%;font-size:10px">
      <el-table-column
        align="center"
        label="B端UID"
        min-width="60px"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.userUid }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="60px" align="center" label="接口调用次数">
        <template slot-scope="scope">
          <span>{{ scope.row.apiCount }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="60px" align="center" label="接口调用总金额（CNY)">
        <template slot-scope="scope">
          <span>{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="60px" align="center" label="匹配成功总订单数">
        <template slot-scope="scope">
          <span>{{ scope.row.matchSuccess }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="匹配成功总金额（CNY）" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.matchSuccessAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="完成订单总单数" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.finishCount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="完成订单总金额（CNY）" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.finishCountAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="B端成功率" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.successPercentB }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="系统成功率" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.successPercentSys }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="匹配失败总订单数" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.matchFailed }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="匹配失败总金额（CNY）" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.matchFailedAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="匹配失败占比" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.matchFailedPercent }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="未扫码总订单数" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.noMatch }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="未扫码总金额（CNY）" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.noMatchAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="未扫码占比" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.noMatchPercent }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付模式" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.paySchema | PaySchemaName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付通道" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.payChannel|PayChannelName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="时间" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

  </div>
</template>

<script>
// import tabPane from './components/TabPane'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import tip from '@/components/Tip'
import waves from '@/directive/waves' // waves directive
import { PayChannel, PayType, PaySchema } from '@/utils/enumeration'
import { merchant_statics_day as listApi } from '@/api/statistic'

export default {
  name: 'UserInstation',
  components: { pagination, tip },
  directives: { waves },

  data() {
    return {
      PayChannel,
      PayType,
      PaySchema,
      filterQuery: {
        date: null,
        payChannel: undefined,
        channelCode: undefined,
        userUid: undefined,
        payType: undefined,
        schema: undefined

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
      auditData: {},
      listLoading: false
    }
  },

  computed: {
    ...mapState({
      adminId: state => state.user.principal.adminId
    })

  },

  mounted() {
    this.getList()
  },
  methods: {

    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page

      const filterQuery = this.filterQuery
      const data = {
        ...this.filterQuery,
        date: undefined
      }
      if (this.filterQuery.date) {
        data.start = this.$moment(filterQuery.date[0]).format('YYYY-MM-DD')
        data.end = this.$moment(filterQuery.date[1]).format('YYYY-MM-DD')
      }

      this.getList(this.meta, data)
    },
    getList(meta, data) {
      this.listLoading = true
      listApi(meta || this.meta, data).then(res => {
        this.listLoading = false

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
      const filterQuery = this.filterQuery
      console.log('filterQuery', this.filterQuery)
      const data = {
        ...this.filterQuery,
        date: undefined
      }
      if (filterQuery.date) {
        data.start = this.$moment(filterQuery.date[0]).format('YYYY-MM-DD')
        data.end = this.$moment(filterQuery.date[1]).format('YYYY-MM-DD')
      }
      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
    }

  }

}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
.merchant-detail-label {
  font-size: 14px;
  font-weight: 500;
  color: #409EFF;
  line-height: 40px;
  height: 40px;
}
.payTypeImage{
  width: 100px;
  height: 100px;
  background-color: #dedede
}
</style>
