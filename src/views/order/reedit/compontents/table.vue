
<template>
  <el-table v-loading="loading" :data="data" border fit highlight-current-row style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <div>
          <h4>支付信息</h4>
          <div><span>支付方式：</span><span>支付支付账号：</span><span>真实姓名：</span></div>
          <h4>补单历史记录</h4>
          <div><span>原订单编号：</span><span>原B端订单编号：</span><span>原订单状态：</span></div>
          <el-table
            :data="props.data"
            stripe
            style="width: 100%"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="180"
            />
            <el-table-column
              prop="name"
              label="姓名"
              width="180"
            />
            <el-table-column
              prop="address"
              label="地址"
            />
          </el-table>

        </div>
      </template>
    </el-table-column>
    <el-table-column

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
        <span>{{ scope.row.payType|payTypeName }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="手续费" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.fee }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="交易时间" min-width="300">
      <template slot-scope="scope">
        <span>{{ scope.row.createTime }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="状态" width="95">
      <template slot-scope="scope">
        <el-link :underline="false" :type="scope.row.orderStatus|orderStatusTagName">{{ scope.row.orderStatus|orderStatus }}</el-link>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="操作" min-width="110">
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

