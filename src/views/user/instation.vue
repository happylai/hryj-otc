<template>
  <div class="tab-container">
    <tip />

    <div
      class="filter-container"
      style="margin-bottom: 10px;"
    >

      <el-input v-model="fliterQuery.query" placeholder="用户名ID/姓名/手机号" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.roleId" placeholder="选择角色" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in UserType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.kycLevel" placeholder="认证状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in KycLevel" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>

      <el-select v-model="fliterQuery.payType" placeholder="收付款方式" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.groupId" placeholder="所在分组" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in Groups" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.active" placeholder="账号状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in AccountStatus" :key="item.id" :label="item.label" :value="item.name" />
      </el-select>

      <el-date-picker
        v-model="fliterQuery.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

    </div>

    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        align="center"
        label="用户ID"
        width="180"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.advertiseId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="可用余额">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" label="成交数量">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="胜诉比">
        <template slot-scope="scope">
          <span>{{ scope.row.appeal_win }}/{{ scope.row.appeal_total }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="完成订单数" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.orders }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="当前角色" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.roleId|userTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="认证状态" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.kycLevel|kycLevel }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收付款方式" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.payTypes|payTypeNums }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="返佣比%" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.rebate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所在分组" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.pricingGroupId|groupName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号状态" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.active?'激活':'冻结' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="操作" width="110">
        <template slot-scope="{row}">
          <el-button type="primary" size="small">详情</el-button>
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
import { Groups, UserType, KycLevel, emptySelect, PayType, AccountStatus } from '@/utils/enumeration'
import { users_web } from '@/api/usermanage'

export default {
  name: 'Tab',
  components: { pagination, tip },
  directives: { waves },
  data() {
    return {
      AccountStatus,
      PayType,
      activeType: '0',
      UserType,
      KycLevel,
      Groups: [emptySelect, ...Groups],
      fliterQuery: {
        page: 1,
        size: 20,
        date: null,
        query: undefined,
        payType: undefined,
        groupId: undefined,
        kycLevel: undefined
      },
      meta: {
        current: 1,
        size: 10
      },
      dialogVisible: false,
      loading: false,
      list: [],
      paginationMeta: {
        total: 10,
        pages: 1
      }
    }
  },

  computed: {
    ...mapState({
      allList: state => state.order.allList,
      allListMeta: state => state.order.allMeta
    })
  },

  mounted() {
    this.getList()
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList()
    },
    getList(meta, data) {
      this.listLoading = true
      users_web(meta || this.meta, data).then(res => {
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
        active: fliterQuery.active,
        kycLevel: fliterQuery.kycLevel,
        groupId: fliterQuery.groupId,
        payType: fliterQuery.payType,
        query: fliterQuery.query,
        roleId: fliterQuery.roleId
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
    toDetail(data) {
      console.log('to detail')
      this.$router.push({ path: `/role/${data.id}`, query: { userId: data.userId, type: 1 }})
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
