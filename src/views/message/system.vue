<template>
  <div class="tab-container">

    <div class="filter-container" style="margin-bottom: 10px;">
      <el-select v-model="fliterQuery.type" placeholder="公告对象" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in SystemMessageTypes" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.status" placeholder="状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in SystemMessageStatus" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="fliterQuery.date"
        class="filter-item"
        type="daterange"
        range-separator="至"
        start-placeholder="发布开始日期"
        end-placeholder="结束日期"
      />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        label="用ID"
        min-width="140"
        prop="uuid"
        element-loading-text="请给我点时间！"
      />
      <el-table-column align="center" class-name="status-col" prop="nickName" label="姓名" min-width="120" />
      <el-table-column align="center" class-name="status-col" label="内容" min-width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.type===0">{{ scope.row.message }}</span>
          <img v-else v-lazy="scope.row.message" :preview="'chat'+scope.row.id" class="chatListImage">
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="时间" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime|timesArrayFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="操作" min-width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="clickDetail(scope.row)">回复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

  </div>
</template>

<script>
import tip from '@/components/Tip'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'

import { message_list as listApi, message_detail, message_reply } from '@/api/message'
import waves from '@/directive/waves' // waves directive
import { SystemMessageTypes, SystemMessageStatus } from '@/utils/enumeration'
export default {
  name: 'Tab',
  components: { tip, pagination },
  directives: { waves },
  data() {
    return {
      SystemMessageTypes,
      SystemMessageStatus,
      fliterQuery: {
        type: undefined,
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
      }

    }
  },
  watch: {

  },

  created() {

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
      listApi(meta || this.meta, data).then(res => {
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
        query: fliterQuery.query
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }

      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
    },
    clickDetail(data) {
      this.$router.push({ path: `system/${data.userId}` })
    }

  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .chatListImage{
    max-width: 60px;
  }
</style>
