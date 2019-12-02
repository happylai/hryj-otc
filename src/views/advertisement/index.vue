<template>
  <div class="tab-container">
    <tip :miain-tip="miainTip" :second-tip="secondTip" :show-contact="false" />

    <div
      class="filter-container"
      style="margin-bottom: 10px;"
    >

      <el-input v-model="fliterQuery.query" placeholder="广告ID / 创建人" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.type" placeholder="广告类型" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in AdvType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.payType" placeholder="收付款方式" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.status" placeholder="状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in AdvStatus" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-date-picker class="filter-item" 
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

        align="center"
        label="广告ID"
        min-width="120px"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.userUuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="币种">
        <template slot-scope="scope">
          <span>{{ scope.row.token }}</span>
        </template>
      </el-table-column>

      <el-table-column width="70px" align="center" label="金额">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="最小成交额">
        <template slot-scope="scope">
          <span>{{ scope.row.minLimit }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最大成交额" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.maxLimit }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型" width="90">
        <template slot-scope="scope">
          <el-link :type="scope.row.type? 'danger':'success'" :underline="false">{{ scope.row.type|advType }}</el-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付方式" min-width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.payType|payTypeNames }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="180px" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="95">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status|advStatusTagName">{{ scope.row.status|advStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="操作" min-width="180px">
        <template slot-scope="scope">
          <el-button type="danger" :disabled="scope.row.status===0" size="small" @click="handleRemove(scope.row.id)">下架</el-button>
          <el-button type="primary" size="small" @click="goDetail(scope.row.id)">详情</el-button>
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
import { PayType, AdvStatus, AdvType } from '@/utils/enumeration'
import { advertises, down_advertise } from '@/api/advertisement'

export default {
  name: 'Advertisement',
  components: { pagination, tip },
  directives: { waves },
  data() {
    return {
      AdvStatus,
      AdvType,
      PayType,
      miainTip: '广告下架：1.查看广告详情；2.核查是否有未完成交易。',
      secondTip: '温馨提示：若遇其他非上述情况请及时联系管理员。',
      fliterQuery: {
        page: 1,
        size: 20,
        date: null,
        query: undefined,
        payType: undefined
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
      },
      auditData: {}
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
      this.getList()
    },
    getList(meta, data) {
      this.listLoading = true
      advertises(meta || this.meta, data).then(res => {
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
        type: fliterQuery.type,
        payType: fliterQuery.payType,
        query: fliterQuery.query,
        status: fliterQuery.status
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
    },

    goDetail(id) {
      this.$router.push({ path: `/advertising/${id}` })
    },
    handleRemove(id) {
      this.$confirm('是否下架该广告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        down_advertise({ id: id }).then(res => {
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
</style>
