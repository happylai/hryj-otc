<template>
  <div class="tab-container">
    <tip />
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">基础信息</span>
      </div>
      <div class="text item">
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>订单ID：{{ modals.orderUuid }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>下单时间：{{ modals.orderTime }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>申诉时间：{{ modals.creatTime }}</div></el-col>
        </el-row>
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>订单状态：{{ modals.appealOrderStatus }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>交易额：{{ modals.amount }}</div></el-col>
        </el-row>
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>买方：{{ modals.buyerUuid }}  <el-link :type="modals.isPay?'success':'danger'">{{ modals.isPay?'已付款':'未付款' }}</el-link> </div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>卖方：{{ modals.buyerId }} <el-link :type="modals.isConfirm?'success':'danger'">{{ modals.isConfirm?'已收款':'未收款' }}</el-link> </div></el-col>
        </el-row>
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>系统： <el-link :type="modals.isConfirm?'success':'danger'">{{ modals.isConfirm?'已放币':'未放币' }}</el-link></div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>手续费：{{ modals.fee }} <el-link :type="modals.isConfirm?'success':'danger'">{{ modals.isConfirm?'已执行':'未执行' }}</el-link></div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>补贴奖励：{{ modals.dealSubsidy }} <el-link :type="modals.isConfirm?'success':'danger'">{{ modals.isConfirm?'已执行':'未执行' }}</el-link></div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6"><div>下级返利：{{ modals.dealSubsidy }} <el-link :type="modals.isConfirm?'success':'danger'">{{ modals.isConfirm?'已执行':'未执行' }}</el-link></div></el-col>
        </el-row>
      </div>
    </el-card>
    <div v-if="activeType==='2'">
      <el-button v-waves class="filter-item" type="primary" @click="handleReplace(true)">
        补单
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 20px" type="info">
        取消
      </el-button>
    </div>
    <div v-if="activeType==='1'">
      <h4>申诉类型： {{ modals.type|appealeType }}</h4>
      <div class="filter-container" style="margin-bottom: 10px;">
        <el-row :gutter="10" class="card-row">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <div>
              <el-card class="box-card">
                <div slot="header" class="clearfix aduitHeader">
                  <span class="card-title">申诉人证据</span>
                </div>
                <div class="text item">
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">申诉时间：</el-col>
                    <el-col :span="18">{{ modals.createTime }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">下单时间：</el-col>
                    <el-col :span="18">{{ modals.orderTime }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">订单ID：</el-col>
                    <el-col :span="18">{{ modals.orderUuid }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">交易额：</el-col>
                    <el-col :span="18">{{ modals.amount }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">发起人：</el-col>
                    <el-col :span="18">{{ modals.sourceUuid }}  {{ modals.sourceUuid===modals.buyerUuid?'买家':'卖家' }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">买家：</el-col>
                    <el-col :span="18">{{ modals.buyerUuid }} {{ modals.isPay?'已付款':'未付款' }} 电话：{{ modals.buyerMobile }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">卖家：</el-col>
                    <el-col :span="18">{{ modals.sellerUuid }} {{ modals.isConfirm?'已收款':'未收款' }} 电话：{{ modals.sellerMobile }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">内容：</el-col>
                    <el-col :span="18">{{ modals.sourceReason }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">图片证据：</el-col>
                    <el-col :span="18">
                      <div v-if="modals.sourceProof" class="images-container">
                        <img v-for="(item,index) in modals.sourceProofArr" :key="index+'sourceProof'" v-lazy="item" class="proofImage" :preview="'sourceProof'" alt="被申诉人证据">
                      </div>
                      <span v-else>无</span>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <div>
              <el-card class="box-card">
                <div slot="header" class="clearfix aduitHeader">
                  <span class="card-title">被申诉人证据</span>
                </div>
                <div class="text item">

                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">补充申诉时间：</el-col>
                    <el-col :span="18">{{ modals.targetTime }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">发起申诉时间：</el-col>
                    <el-col :span="18">{{ modals.createTime }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">订单ID：</el-col>
                    <el-col :span="18">{{ modals.orderUuid }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">交易额：</el-col>
                    <el-col :span="18">{{ modals.amount }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">被申诉人：</el-col>
                    <el-col :span="18">{{ modals.targetUuid }} {{ modals.targetUuid===modals.buyerUuid?'买家':'卖家' }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">买家：</el-col>
                    <el-col :span="18">{{ modals.buyerUuid }} {{ modals.isPay?'已付款':'未付款' }} 电话：{{ modals.buyerMobile }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">卖家：</el-col>
                    <el-col :span="18">{{ modals.sellerUuid }} {{ modals.isConfirm?'已收款':'未收款' }} 电话：{{ modals.sellerMobile }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">内容：</el-col>
                    <el-col :span="18">{{ modals.targetReason }}</el-col>
                  </el-row>
                  <el-row :gutter="20" class="rowLine">
                    <el-col :span="6" class="textAlingR">图片内容：</el-col>
                    <el-col :span="18">
                      <div v-if="modals.targetProof" class="images-container">
                        <img v-for="(item,index) in modals.targetProofArr" :key="index+'targetProof'" v-lazy="item" class="proofImage" :preview="'targetProof'" alt="被申诉人证据">
                      </div>
                      <span v-else>无</span>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>

      </div>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="card-title">申诉处理</span>
        </div>
        <div class="text item">
          <el-input
            v-model="resultReason"
            type="textarea"
            :rows="8"
            placeholder="请输入处理反馈描述，该描述将以推送方式至申诉双方的消息中心。"
          />
        </div>
        <div style="margin-top:10px">
          <!-- <el-button v-waves class="filter-item" type="primary" @click="handleAudit(true)">
            申诉人胜
          </el-button>
          <el-button v-waves class="filter-item" style="margin-left: 20px" type="info" @click="handleAudit(false)">
            申诉人败
          </el-button> -->
          <el-button type="primary" size="small" @click="handleAudit(1,undefined,'强制完成')">强制完成</el-button>
          <el-button type="primary" size="small" style="margin-left: 20px" @click="handleAudit(2,undefined,'强制取消')">强制取消</el-button>
          <el-button type="primary" size="small" style="margin-left: 20px" @click="handleAudit(3,0,'驳回买家')">驳回买家</el-button>
          <el-button type="primary" size="small" style="margin-left: 20px" @click="handleAudit(4,1,'驳回卖家')">驳回卖家</el-button>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import tip from '@/components/Tip'
import pagination from '@/components/Pagination'
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect, OrderStatus, CounterParty, PayType } from '@/utils/enumeration'
import { order_appeal_detail, order_appeal_audit, order_reorder_detail, order_redo } from '@/api/order'

export default {
  name: 'Tab',
  components: { pagination, tip },
  directives: { waves },
  data() {
    return {
      testImages: ['https://via.placeholder.com/350x150', 'https://via.placeholder.com/600x800'],
      groupsConstName,
      userRolesConstName,
      adminRolesConstName,
      UserType,
      PayType,
      OrderStatus,
      CounterParty,
      Authents: [{ id: '',
        mame: '',
        label: '请选择'
      }, ...Authents],
      Groups: [emptySelect, ...Groups],
      fliterQuery: {
        page: 1,
        size: 20,
        date: null,
        query: undefined,
        authent: undefined,
        groupId: undefined,
        status: undefined
      },
      type: undefined,
      meta: {
        current: 1,
        size: 10
      },
      activeType: '1',
      loading: false,
      list: [],
      paginationMeta: {
        total: 10,
        pages: 1
      },
      id: undefined,
      dialogVisible: false,
      modals: {},
      editData: {},
      newData: {},
      resultReason: undefined
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
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeType = tab
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.type = this.$route.query.type
    this.detail(this.id)
  },
  methods: {

    detail(id) {
      this.listLoading = true
      const apiArr = ['', order_appeal_detail, order_reorder_detail]
      const data = this.activeType === '1' ? { appealId: id || this.id } : { id: id }
      apiArr[this.activeType](data).then(res => {
        if (res.code === 0) {
          const data = res.data
          if (data.targetProof) {
            data.targetProofArr = data.targetProof.split(',')
          }
          if (data.sourceProof) {
            data.sourceProofArr = data.sourceProof.split(',')
          }
          this.modals = data
        }
        this.$previewRefresh()
        console.log('res')
      })
    },

    handleAudit(data, rejectParty, text) {
      if (!this.resultReason) {
        this.$message.error('请输入申诉处理描述')
        return false
      }
      const postData = {
        adminId: this.adminId,
        id: this.id,
        result: data,
        resultReason: this.resultReason,
        rejectParty: rejectParty
      }
      this.$confirm(`确认${text}`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'danger'
      }).then((val) => {
        this.appealAudit(postData)
      })
    },
    appealAudit(data) {
      console.log('data', data)
      order_appeal_audit(data).then(res => {
        if (res.code === 0) {
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
    },
    handleReplace() {
      this.$confirm('是否补单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((val) => {
        order_redo({ ids: this.id }).then(res => {
          if (res.code === 0) {
            this.getList()
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
.card-title{
  font-weight: bold;
  font-size: 16px
}
.card-row{
  margin: 40px 0;
}
.marginT20{
  margin-top: 20px
}
.card-item{
  height: 100px;
  margin: 0 20px;
}
.borderR{
  border-right: 1px solid #ccc;

}
.cart-i-t{
  font-size: 14px
}
.cart-i-v{
  height: 60px;
  line-height: 60px;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  text-indent: -30px;
}
.rowLine {
  min-height: 20px;
  margin: 15px 0;
}
.aduitHeader{
  text-align: center
}
.images-container{
  overflow: hidden;
}
.proofImage{
  /* max-width: 100%; */
  max-width: 60px;
  max-height: 100px;
  margin-right: 10px;

}
</style>
