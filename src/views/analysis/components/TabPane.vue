<template>
  <el-table :data="data" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading"
      align="center"
      label="用户ID"
      width="65"
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

    <el-table-column width="70px" align="center" label="成交数量">
      <template slot-scope="scope">
        <span>{{ scope.row.balance }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="胜诉比">
      <template slot-scope="scope">
        <span>{{ scope.row.appeal_win }}/{{ scope.row.appeal_total }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="完成订单数" width="55">
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
        <span>{{ scope.row.kycLevel }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="收付款方式" minwidth="300">
      <template slot-scope="scope">
        <span>{{ scope.row.payTypes }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="返佣比%" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.rebate }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="所在分组" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.pricingGroupId }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="注册时间" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.createTime }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="账号状态" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.active }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="操作" width="110">
      <template slot-scope="{row}">
        <el-button type="primary" size="small">详情</el-button>
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
      },
      loading: false
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
    }
  }
}
</script>

