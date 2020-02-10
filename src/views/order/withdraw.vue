<template>
  <div class="tab-container">
    <tip miain-tip="出金列表要注意：1.查看订单详情；2.被申诉次数大于5则不予通过。" second-tip="温馨提示：若遇其他无法处理情况请及时联系管理员。" />
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.query" placeholder="订单ID/用户ID/用户名/广告ID/买家/备注信息" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.payType" placeholder="支付方式" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.status" placeholder="订单状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in OrderStatus" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.auditStatus" placeholder="审核状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in OrderAuditStatus" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="fliterQuery.creatDate"
        class="filter-item"
        type="daterange"
        range-separator="至"
        start-placeholder="订单完创建开始日期"
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

      <el-table-column align="center" label="交易数量(PQC)" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="交易总价(CNY)">
        <template slot-scope="scope">
          <span>{{ scope.row.legalAmount }}</span>
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

      <el-table-column align="center" label="订单状态" minwidth="300">
        <template slot-scope="scope">
          <el-link :underline="false" :type="scope.row.orderStatus|orderStatusTagName">{{ scope.row.orderStatus|orderStatus }}</el-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核状态" minwidth="300">
        <template slot-scope="scope">
          <el-link :underline="false" :type="scope.row.auditStatus|OrderAuditStatusName">{{ scope.row.auditStatus|OrderAuditStatusName }}</el-link>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="操作" width="110">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="paginationMeta.current" :limit.sync="meta.size" @pagination="paginationChange" />

    <el-dialog v-loading="detailLoading" :visible.sync="dialogVisible" title="订单详情" width="800px">
      <h3>订单信息</h3>
      <el-row :gutter="20" class="">
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 订单ID:{{ editData.orderId }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 商家订单ID :</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 卖家UID:{{ editData.seller }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 买家UID:{{ editData.buyer }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 支付方式:{{ editData.payType|payTypeName }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 支付账号:{{ editData.payInfo.account }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 真实姓名:{{ editData.payInfo.real }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 开户行:{{ editData.payInfo.bank }} {{ editData.payInfo.bankBranch }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 交易单价:{{ editData.price }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 交易数量:{{ editData.amount }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 交易金额(CNY):{{ editData.legalAmount }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 付款备注:{{ editData.memo }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 手续费:{{ editData.fee }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 订单状态:{{ editData.orderStatus|orderStatus }}</div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
          <div class="orderInfoItem"> 审核处理人:{{ editData.auditAdmin }}</div>
        </el-col>
      </el-row>
      <div>
        <h3>支付凭证</h3>

        <el-collapse v-model="activeNames" @change="handleCollapseChange">
          <template slot="title">
            <h3>支付凭证</h3>
          </template>
          <el-collapse-item title="最新凭证" name="1">
            <img v-if="editData.paymentUrlOne" v-lazy="editData.paymentUrlOne" class="DetailvoucherImage" :preview="`${editData.id}withdarw011`" @click="dialogVisible=false">
            <span v-else>无</span>
            <img v-if="editData.paymentUrlTwo" v-lazy="editData.paymentUrlTwo" class="DetailvoucherImage" :preview="`${editData.id}withdarw011`" @click="dialogVisible=false">
            <img v-if="editData.paymentUrlThree" v-lazy="editData.paymentUrlThree" class="DetailvoucherImage" :preview="`${editData.id}withdarw011`" @click="dialogVisible=false">

          </el-collapse-item>
          <el-collapse-item title="历史凭证" name="2">
            <div v-if="historyVoucher&&historyVoucher.length===0">暂无</div>
            <div v-else>
              <div v-for="(item,index) in historyVoucher" :key="`historyVoucher${index}`">
                <div>处理人ID；{{ item.auditAdmin }}</div>
                <div>提交时间：{{ item.createTime }}</div>
                <div>处理时间：</div>
                <div>
                  <img v-if="item.paymentUrlOne" v-lazy="item.paymentUrlOne" class="DetailvoucherImage" :preview="`${item.id}withdarwHistory`" @click="dialogVisible=false">
                  <span v-else>无</span>
                  <img v-if="item.paymentUrlTwo" v-lazy="item.paymentUrlTwo" class="DetailvoucherImage" :preview="`${item.id}withdarwHistory`" @click="dialogVisible=false">
                  <img v-if="item.paymentUrlThree" v-lazy="item.paymentUrlThree" class="DetailvoucherImage" :preview="`${item.id}withdarwHistory`" @click="dialogVisible=false">

                </div>
              </div>
            </div>

          </el-collapse-item>
        </el-collapse>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAudit(1)">通过</el-button>
        <el-button type="info" @click="handleAudit(2)">驳回</el-button>
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
import { PayType, OrderStatus, OrderAuditStatus } from '@/utils/enumeration'
import { order_out_orders, out_order_detail, out_order_audit, out_order_reorders } from '@/api/order'

export default {
  name: 'Tab',
  components: { pagination, tip },
  directives: { waves },
  data() {
    return {
      PayType,
      OrderStatus,
      OrderAuditStatus,
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
        auditStatus: undefined,
        creatDate: undefined
      },
      meta: {
        current: 1,
        size: 10
      },
      activeNames: ['1'],
      loading: false,
      list: [],
      paginationMeta: {
        total: 10,
        pages: 1
      },
      editData: {
        payInfo: {}
      },
      dialogVisible: false,
      detailLoading: false,
      historyVoucher: undefined
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
          this.$previewRefresh()
        }
      })
    },
    handleFilter() {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        payType: fliterQuery.payType,
        query: fliterQuery.query,
        status: fliterQuery.status,
        auditStatus: fliterQuery.auditStatus
      }
      if (fliterQuery.creatDate) {
        data.createStart = this.$moment(fliterQuery.creatDate[0]).format('YYYY-MM-DD HH:mm:ss')
        data.createEnd = this.$moment(fliterQuery.creatDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
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
      this.historyVoucher = undefined
      this.dialogVisible = true
    },
    handleAudit(status) {
      const data = {
        adminId: this.adminId,
        id: this.editData.id,
        auditStatus: status
      }
      if (status === 2) {
        this.$prompt('请输入驳回理由', '提示', {
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
          this.handleFilter()
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
    },
    handleCollapseChange(data) {
      const hasVoucher = data.includes('2') && this.historyVoucher
      if (!hasVoucher) {
        this.getHistoryVoucher()
      }
    },
    getHistoryVoucher() {
      out_order_reorders(this.editData.id).then(res => {
        if (res.code === 0) {
          this.historyVoucher = res.data
        }
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
.orderInfoItem{
  margin:8px 2px;
}
.DetailvoucherImage{max-height: 120px;max-width: 120px}
</style>
