
<template>
  <el-table v-loading="loading" :data="data" border fit highlight-current-row style="width: 100%" @expand-change="tableExpandChange">
    <el-table-column v-if="type==='1'" type="expand">
      <template slot-scope="scope">
        <div v-loading="orderDetailLoading">
          <h4>支付信息</h4>
          <div><span>支付方式：{{ scope.row.payInfo.payType|payTypeName }} </span><span> 支付账号：{{ scope.row.payInfo.account }}</span><span>真实姓名：{{ scope.row.payInfo.real }}</span></div>
          <h4>补单历史记录</h4>
          <div><span>原订单编号：{{ scope.row.oldOrder }}</span><span>原B端订单编号：{{ scope.row.merchantOrderNo }}</span><span>原订单状态：{{ scope.row.oldStatus }}</span></div>
          <el-table
            :data="scope.row.reorderRecords"
            stripe
            style="width: 100%"
          >
            <el-table-column
              prop="orderNo"
              label="订单号"
              width="180"
            />
            <el-table-column
              prop="finishTime"
              label="完成时间"
              width="180"
            />
            <el-table-column
              label="处理方式"
              width="180"
            >
              <template slot-scope="scope">
                <span>补单</span>
              </template>
            </el-table-column></el-table>

        </div>
      </template>
    </el-table-column>
    <el-table-column

      align="center"
      label="B端UID"
      min-width="120"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.merchantUid }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="原订单号">
      <template slot-scope="scope">
        <span>{{ scope.row.newOrder }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="新订单号">
      <template slot-scope="scope">
        <span>{{ scope.row.oldOrder }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="180px" align="center" label="B端订单号">
      <template slot-scope="scope">
        <span>{{ scope.row.merchantOrderNo }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="180px" align="center" label="原广告ID">
      <template slot-scope="scope">
        <span>{{ scope.row.advertiseNo }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="原交易单价">
      <template slot-scope="scope">
        <span>{{ scope.row.price }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="原交易总价" min-width="120">
      <template slot-scope="scope">
        <span>{{ scope.row.legalAmount }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="预处理创建时间" min-width="300">
      <template slot-scope="scope">
        <span>{{ scope.row.createTime }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="处理人" min-width="300">
      <template slot-scope="scope">
        <span>{{ scope.row.admin }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="原订单状态" width="95">
      <template slot-scope="scope">
        <el-link :underline="false" :type="scope.row.oldStatus|orderStatusTagName">{{ scope.row.orderStatus|orderStatus }}</el-link>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="操作" min-width="110">
      <template slot-scope="scope">
        <el-button v-if="type==='1'" type="primary" size="small" @click="goDetail(scope.row)">处理</el-button>
        <el-button type="danger" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import { fetchList } from '@/api/article'
import { reorder_pres as listApi, pro_order_detail, pre_odrder_save, pre_odrder_confirm } from '@/api/order'

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
      default: '1'
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
      loading: false,
      orderDetailLoading: false
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
    getOrderDetail(id) {
      this.orderDetailLoading = true
      pro_order_detail(id).then(res => {
        this.orderDetailLoading = false
        if (res.code === 0) {
          this.modals = res.data
        }
      }).catch(() => {
        this.orderDetailLoading = false
      })
    },
    tableExpandChange(expandData, id) {
      console.log('expand data', expandData, id)
      this.getOrderDetail(expandData.preId)
    },
    goDetail(data) {
      this.$router.push({ path: `reedit/${data.preId}` })
    }

  }
}
</script>

