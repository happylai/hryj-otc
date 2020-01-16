<template>
  <div class="tab-container">

    <div class="filter-container" style="margin-bottom: 10px;">
      <el-select v-model="fliterQuery.searchEnum" placeholder="公告对象" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in SystemMessageTypes" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.onLine" placeholder="状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in SystemMessageStatus" :key="item.id" :label="item.label" :value="item.value" />
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
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-plus" @click="addNew">
        添加新公告
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        label="编号"
        min-width="140"
        prop="id"
        element-loading-text="请给我点时间！"
      />
      <el-table-column align="center" class-name="status-col" label="公告对象" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.app?'App':null }}</span>
          <span>{{ scope.row.merchant?'B端后台':null }}</span>
          <span>{{ scope.row.web?'Web端':null }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" prop="title" label="标题" min-width="120" />

      <el-table-column align="center" class-name="status-col" label="状态" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.online?"上架":"下架" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="发布时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="操作" min-width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="clickDetail(scope.row.id)">查看详情</el-button>
          <el-button v-if="!scope.row.online" :disabled="loading" :loading="loading" type="success" size="small" @click="publish(scope.row.id)">上架</el-button>
          <el-button v-if="scope.row.online" type="danger" :loading="loading" size="small" @click="unPublish(scope.row.id)">下架</el-button>
          <el-button type="danger" size="small" :loading="loading" @click="delNotice(scope.row.id)">删除</el-button>
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

import { notice_list as listApi, notice_delete, dis_online, notice_online } from '@/api/notice'
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
        searchEnum: undefined,
        onLine: undefined,
        date: undefined
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
      const data = {
        ...this.fliterQuery,
        date: undefined
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }

      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
    },

    publish(noticeId) {
      this.loading = true
      notice_online({ noticeId: noticeId }).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.handleFilter()
        } else {
          this.$message.error(res.message || '操作失败,请重试')
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message || '操作失败,请重试')
      })
    },
    unPublish(noticeId) {
      this.loading = true
      dis_online({ noticeId: noticeId }).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '上架成功'
          })
          this.handleFilter()
        } else {
          this.$message.error(res.message || '操作失败,请重试')
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message || '操作失败,请重试')
      })
    },
    delNotice(noticeId) {
      this.loading = true
      notice_delete({ noticeId: noticeId }).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.handleFilter()
        } else {
          this.$message.error(res.message || '操作失败,请重试')
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message || '操作失败,请重试')
      })
    },
    clickDetail(id) {
      this.$router.push({ path: `system/${id}` })
    },
    addNew() {
      this.$router.push({ path: `system/new` })
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
