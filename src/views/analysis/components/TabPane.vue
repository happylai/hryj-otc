<template>
  <el-table :data="data" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading"
      align="center"
      label="订单ID"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

   <el-table-column width="180px" align="center" label="所属广告">
      <template slot-scope="scope">
        <span>{{ scope.row.advertiseId }}</span>
      </template>
    </el-table-column>

   <el-table-column width="80px" align="center" label="类型">
      <template slot-scope="scope">
        <span>{{ scope.row.token }}</span>
      </template>
    </el-table-column>

    <el-table-column width="70px" align="center" label="币种">
      <template slot-scope="scope">
        <span>{{ scope.row.token }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="交易额">
      <template slot-scope="scope">
        <span>{{ scope.row.price }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="卖家" width="55">
      <template slot-scope="scope">
        <span>{{ scope.row.seller }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="支付方式" width="90">
      <template slot-scope="scope">
        <span>{{ scope.row.payType|paymentStatus }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="手续费" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.fee }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="交易时间" minwidth="300">
      <template slot-scope="scope">
        <span>{{ scope.row.createTime }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="状态" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.orderStatus|orderStatus }}</span>
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
    data:{
      type:Array,
      default:[]
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

