<template>
  <div class="tab-container">
    <tip miain-tip="出金审核要注意：1.查看订单详情；2.被申诉次数大于5则不予通过。" second-tip="温馨提示：若遇其他无法处理情况请及时联系管理员。" />
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.query" placeholder="订单ID/用户ID/用户名/广告ID/买家/备注信息" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.payType" placeholder="支付方式" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.status" placeholder="订单状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in OrderStatus" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-date-picker class="filter-item" 
        v-model="fliterQuery.creatDate"
        type="daterange"
        range-separator="至"
        start-placeholder="订单完创建开始日期"
        end-placeholder="结束日期"
      />
      <el-date-picker class="filter-item" 
        v-model="fliterQuery.complateDate"
        type="daterange"
        range-separator="至"
        start-placeholder="交易完成开始日期"
        end-placeholder="结束日期"
      />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        align="center"
        label="订单ID"
        width="220"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="140px" align="center" label="用户ID">
        <template slot-scope="scope">
          <span>{{ scope.row.seller }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="支付凭证">
        <template slot-scope="scope">
          <img v-if="scope.row.paymentUrlOne" v-lazy="scope.row.paymentUrlOne" class="voucherImage" :preview="scope.row.id+'withdarw0'">
          <span v-if="!scope.row.paymentUrlOne">无</span>
          <img v-if="scope.row.paymentUrlTwo" v-lazy="scope.row.paymentUrlTwo" class="voucherImage" :preview="scope.row.id+'withdarw0'">
          <img v-if="scope.row.paymentUrlThree" v-lazy="scope.row.paymentUrlThree" class="voucherImage" :preview="scope.row.id+'withdarw0'">
        </template>
      </el-table-column>

      <el-table-column align="center" label="买家" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.buyer }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="交易额" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手续费" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.fee }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请时间" min-width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" minwidth="300">
        <template slot-scope="scope">
          <el-link :underline="false" :type="scope.row.orderStatus|orderStatusTagName">{{ scope.row.orderStatus|orderStatus }}</el-link>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="操作" width="110">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="paginationMeta.current" :limit.sync="meta.size" @pagination="paginationChange" />

    <el-dialog v-loading="detailLoading" :visible.sync="dialogVisible" title="基础信息审核">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">订单ID：</el-col>
        <el-col :span="16">{{ editData.orderUuid }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">时间：</el-col>
        <el-col :span="16">{{ editData.createTime }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">用户ID：</el-col>
        <el-col :span="16">{{ editData.seller }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">姓名：</el-col>
        <el-col :span="16">{{ editData.realName }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">审核状态：</el-col>
        <el-col :span="16">{{ editData.auditStatus|orderAuditStatus }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">申诉次数：</el-col>
        <el-col :span="16">{{ editData.appealNum }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">被申诉次数：</el-col>
        <el-col :span="16">{{ editData.appealedNum }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">交易金额：</el-col>
        <el-col :span="16">{{ editData.amount }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">手续费：</el-col>
        <el-col :span="16">{{ editData.fee }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">系统补贴：</el-col>
        <el-col :span="16">{{ editData.sysSubsidy }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">放币时间：</el-col>
        <el-col :span="16">无字段</el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAudit(1)">通过</el-button>
        <el-button type="info" @click="handleAudit(2)">不通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import tabPane from './components/TabPane'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import tip from '@/components/Tip'
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'
import waves from '@/directive/waves' // waves directive
import { PayType, OrderStatus } from '@/utils/enumeration'
import { order_out_orders, out_order_detail, out_order_audit } from '@/api/order'

export default {
  name: 'Tab',
  components: { pagination, tip },
  directives: { waves },
  data() {
    return {
      PayType,
      OrderStatus,
      imgs: 'http://static.runoob.com/images/demo/demo1.jpg',
      groupsConstName,
      userRolesConstName,
      adminRolesConstName,
      activeType: '0',

      fliterQuery: {
        page: 1,
        size: 10,
        payType: undefined,
        query: undefined,
        status: undefined,
        creatDate: undefined,
        complateDate: undefined
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
      },
      editData: {},
      dialogVisible: false,
      detailLoading: false
    }
  },

  computed: {
    ...mapState({
      adminId: state => state.user.principal.adminId
    }),
    ...mapGetters([
      'groupsConst',
      'userRolesConst',
      'adminRolesConst'
    ])
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
      order_out_orders(meta || this.meta, data).then(res => {
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
        payType: fliterQuery.payType,
        query: fliterQuery.query,
        status: fliterQuery.status
      }
      if (fliterQuery.creatDate) {
        data.createStart = this.$moment(fliterQuery.creatDate[0]).format('YYYY-MM-DD HH:mm:ss')
        data.createEnd = this.$moment(fliterQuery.creatDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      if (fliterQuery.complateDate) {
        data.confirmStart = this.$moment(fliterQuery.complateDate[0]).format('YYYY-MM-DD HH:mm:ss')
        data.confirmEnd = this.$moment(fliterQuery.complateDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
    },
    getDetail(id) {
      this.detailLoading = true
      out_order_detail({ outId: id }).then(res => {
        this.detailLoading = false

        if (res.code === 0) {
          this.editData = res.data
        }
      })
    },
    handleDetail(data) {
      console.log('to detail')
      this.getDetail(data.id)
      this.editData = data
      this.dialogVisible = true
    },
    handleAudit(status) {
      const data = {
        adminId: this.adminId,
        id: this.editData.id,
        auditStatus: status
      }
      if (status === 2) {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          data.reason = value
          this.audit(data)
        }).catch(() => {

        })
      } else {
        this.audit(data)
      }
    },
    audit(data) {
      this.detailLoading = true
      out_order_audit(data).then(res => {
        this.detailLoading = false
        if (res.code === 0) {
          this.dialogVisible = false
          this.detail(this.id)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.$message.error(err.message || '操作失败')

        this.detailLoading = false
      })
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
.filter-item{
  margin-top:5px
}
.voucherImage{
  max-width: 34px;
  height:34px;
}
</style>
