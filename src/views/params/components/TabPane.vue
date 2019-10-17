<template>
  <el-table :data="data" border fit highlight-current-row style="width: 800px">
    <el-table-column v-loading="loading" align="center" label="角色" width="100" element-loading-text="请给我点时间！">
      <template slot-scope="scope">
        <span>{{ scope.row.roleId|userTypeName }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="180px" align="center" label="有效时间">
      <template slot-scope="scope">
        <span>{{ scope.row.time }}分钟</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" align="center" label="操作" width="110">
      <template slot-scope="scope">
        <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
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
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: []
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
    edit(data) {
      this.$emit('edit', data)
    }
  }
}
</script>

