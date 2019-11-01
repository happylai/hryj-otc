<template>
  <el-table :data="data" border fit highlight-current-row style="width: 100%">
    <el-table-column v-loading="loading" align="center" label="用户名" width="220" element-loading-text="请给我点时间！">
      <template slot-scope="scope">
        <span>{{ scope.row.username }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="账号">
      <template slot-scope="scope">
        <span>{{ scope.row.email }}</span>
      </template>
    </el-table-column>

    <el-table-column width="80px" align="center" label="IP地址">
      <template slot-scope="scope">
        <span>{{ scope.row.ip||'-' }}</span>
      </template>
    </el-table-column>

    <el-table-column width="150px" align="center" label="角色">
      <template slot-scope="scope">
        <span>{{ scope.row.role }}</span>
      </template>
    </el-table-column>

    <el-table-column width="150px" align="center" label="权限">
      <template slot-scope="scope">
        <span>{{ scope.row.auth }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="创建时间" min-width="160">
      <template slot-scope="scope">
        <span>{{ scope.row.createTime|timestampFormat }}</span>
      </template>
    </el-table-column>

    <!-- <el-table-column align="center" label="状态" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.orderStatus|orderStatus }}</span>
      </template>
    </el-table-column> -->

    <el-table-column class-name="status-col" align="center" label="操作" width="220">
      <template slot-scope="scope">
        <el-button type="primary" size="small" @click="clickEdit(scope.row)">编辑</el-button>
        <el-button type="danger" size="small" @click="clickFreeze(scope.row.id)">冻结</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import { fetchList } from '@/api/article'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'CN'
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        limit: 5,
        type: this.type,
        sort: '+id'
      }
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.loading = false
      })
    },
    clickFreeze(id) {
      this.$confirm('是否冻结此帐号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('freeze', id)
      }).catch(() => {

      })
    },
    clickEdit(data) {
      this.$emit('edit', data)
    }
  }
}
</script>

