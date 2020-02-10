<template>
  <div class="tab-container">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.query" placeholder="所属模块/操作类型" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.model" placeholder="所属模块" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in LogsModels" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.type" placeholder="操作类型" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in LogsTypes" :key="item.id" :label="item.label" :value="item.id" />
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
      <el-table-column min-width="80px" align="center" prop="creator" label="操作者" />
      <el-table-column min-width="120px" align="center" prop="ip" label="IP" />
      <el-table-column align="center" label="所属模块" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.model|LogsModelsName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作类型" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.type|LogsTypesName }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" label="浏览器信息">
        <template slot-scope="scope">
          <el-tooltip placement="right">
            <div slot="content">{{ scope.row.browser }}</div>
            <span class="text-overflow-hidden">{{ scope.row.browser }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" label="访问路径" >
        <template slot-scope="scope">
          <el-tooltip placement="right">
            <div slot="content">{{ scope.row.path }}</div>
            <span class="text-overflow-hidden">{{ scope.row.path }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" label="操作描述" prop="operateDesc" />
      <el-table-column min-width="180px" align="center" label="传入参数">
        <template slot-scope="scope">
          <el-tooltip placement="right">
            <div slot="content">
              <pre>{{ JSON.parse(scope.row.params)  }}</pre>
            </div>
            <span class="text-overflow-hidden">{{ scope.row.params }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作时间" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime|timesArrayFormat }}</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

  </div>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { LogsModels, LogsTypes } from '@/utils/enumeration'
import { operate_logs } from '@/api/admin'
import pagination from '@/components/Pagination'

export default {
  name: 'RolesList',
  directives: { waves },
  components: { pagination },

  data() {
    return {
      LogsModels,
      LogsTypes,
      list: [],
      fliterQuery: {
        date: undefined,
        type: undefined,
        model: undefined,
        query: undefined
      },
      loading: false,
      meta: {
        current: 1,
        size: 10
      },
      paginationMeta: {
        total: 10,
        pages: 1
      },
      json:{
        hello:123,
        hif:3123
      }
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {
    this.getList()
  },
  methods: {

    getList(meta, data) {
      this.loading = true
      operate_logs(meta || this.meta, data || { }).then(res => {
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
        date: undefined
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      resetPage ? meta.current = 1 : null

      this.getList(meta, data)
    },
    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.handleFilter(false)
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
.text-overflow-hidden{
  overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
</style>
