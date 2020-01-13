
<template>
  <el-table v-loading="loading" :data="data" border fit highlight-current-row style="width: 100%;font-size:10px" @expand-change="tableExpandChange">
    <el-table-column v-if="type==='2'" type="expand">
      <template slot-scope="scope">
        <div v-loading="orderDetailLoading">
          <h4>支付信息</h4>
          <div><span>支付方式：{{ scope.row.payInfo.payType|payTypeName }} </span><span> 支付账号：{{ scope.row.payInfo.account }}</span><span>真实姓名：{{ scope.row.payInfo.real }}</span></div>
          <h4>补单历史记录</h4>
          <div><span>原订单编号：{{ scope.row.oldOrder }}</span><span>原B端订单编号：{{ scope.row.merchantOrderNo }}</span><span>原订单状态：{{ scope.row.oldStatus|orderStatus }}</span></div>
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

    <el-table-column min-width="120px" align="center" label="新订单号">
      <template slot-scope="scope">
        <span>{{ scope.row.newOrder }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120px" align="center" label="原订单号">
      <template slot-scope="scope">
        <span>{{ scope.row.oldOrder }}</span>
      </template>
    </el-table-column>

    <el-table-column max-width="120px" align="center" label="原B端订单号">
      <template slot-scope="scope">
        <span>{{ scope.row.merchantOrderNo }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120px" align="center" label="原广告ID">
      <template slot-scope="scope">
        <span>{{ scope.row.advertiseNo }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="新交易单价">
      <template slot-scope="scope">
        <span>{{ scope.row.price }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="新交易数量">
      <template slot-scope="scope">
        <span>{{ scope.row.amount }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="新交易总价" min-width="120">
      <template slot-scope="scope">
        <span>{{ scope.row.legalAmount }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="处理时间" min-width="120">
      <template slot-scope="scope">
        <span>{{ scope.row.finishTime }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="处理人" min-width="90">
      <template slot-scope="scope">
        <span>{{ scope.row.admin }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="状态" width="70">
      <template slot-scope="scope">
        <el-link :underline="false" type="success">已处理</el-link>
      </template>
    </el-table-column>

    <el-table-column align="center" class-name="status-col" label="操作" min-width="210">
      <template slot-scope="scope">
        <el-button :loading="actionLoading" :disabled="actionLoading" type="primary" size="small" @click="goDetail(scope.row.preId)">详情</el-button>
        <el-button :loading="actionLoading" :disabled="actionLoading" type="primary" size="small" @click="handleCallBack(scope.row.preId)">回调</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import { fetchList } from '@/api/article'
import { reorder_pres as listApi, pro_order_detail, pre_odrder_save, pre_odrder_confirm, pre_odrder_call_back } from '@/api/order'

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
      orderDetailLoading: false,
      actionLoading: false
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
    hancleDel(id) {
      this.$emit('del', id)
    },

    handleCallBack(id) {
      this.actionLoading = true
      pre_odrder_call_back({ preId: id }).then(res => {
        this.actionLoading = false
        if (res.code === 0) {
          this.$message({ message: res.message || '操作成功', type: 'success' })
          this.$emit('refresh')
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.actionLoading = true
        this.$message.error(err.message || '操作失败')
      })
    },

    tableExpandChange(expandData, id) {
      console.log('expand data', expandData, id)
      this.getOrderDetail(expandData.preId)
    },
    goDetail(preId) {
      this.$router.push({ path: `reedit/${preId}` })
    }

  }
}
</script>

