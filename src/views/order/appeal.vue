<template>
  <div class="tab-container">
    <el-tabs v-model="activeType" style="margin-top:15px;" @tab-click="handleTabClick">
      <el-tab-pane :label="tabMapOptions[0].label" :name="tabMapOptions[0].key">
        <tip />
        <div class="filter-container" style="margin-bottom: 10px;">
          <el-input v-model="fliterQuery.query" placeholder="订单ID/发起人" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="fliterQuery.type" placeholder="申诉类型" clearable style="width: 140px" class="filter-item">
            <el-option v-for="item in AppealeType" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <el-select v-model="fliterQuery.PriceTread" placeholder="订单类型" clearable style="width: 140px" class="filter-item">
            <el-option v-for="item in PriceTread" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <!-- <el-select v-model="fliterQuery.status" placeholder="申诉状态" clearable style="width: 140px" class="filter-item">
            <el-option v-for="item in AppealeStatus" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <el-select v-model="fliterQuery.result" placeholder="处理结果" clearable style="width: 140px" class="filter-item">
            <el-option v-for="item in AppealeResult" :key="item.id" :label="item.label" :value="item.id" />
          </el-select> -->
          <el-date-picker
            v-model="fliterQuery.creatDate"
            class="filter-item"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />

          <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
          <el-table-column

            align="center"
            label="申诉ID"
            min-width="120"
            element-loading-text="请给我点时间！"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.uuid }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120" align="center" label="申诉类型">
            <template slot-scope="scope">
              <span>{{ scope.row.type|appealeType }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120" align="center" label="订单类型">
            <template slot-scope="scope">
              <span>{{ scope.row.PriceTread|PriceTreadName }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120" align="center" label="订单ID">
            <template slot-scope="scope">
              <span>{{ scope.row.orderUuid }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="发起人证据" min-width="120">
            <template slot-scope="scope">
              <img v-if="scope.row.sourceProof" v-lazy="scope.row.sourceProof" class="appealImage" :preview="scope.row.id+'apple0'">
              <span v-els>无</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="120px" label="描述">
            <template slot-scope="scope">
              <span>{{ scope.row.sourceReason }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="发起人" min-width="120">
            <template slot-scope="scope">
              <span>
                <el-link :underline="false" type="primary" un>
                  <i class="el-icon-info" @click="showUserDetail(scope.row.sourceId,scope.row.sourceType)" />
                </el-link>
                {{ scope.row.sourceUuid }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="被申诉人" min-width="120">
            <template slot-scope="scope">
              <span>
                <el-link :underline="false" type="primary">
                  <i class="el-icon-info" @click="showUserDetail(scope.row.targetId,scope.row.targetType)" />
                </el-link>
                {{ scope.row.targetUuid }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="申诉时间" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="处理时间" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.resultTime }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" class-name="status-col" label="操作" min-width="220">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleAudit(scope.row)">强制完成</el-button>
              <el-button type="primary" size="small" @click="handleAudit(scope.row)">强制取消</el-button>
              <el-button type="primary" size="small" @click="handleAudit(scope.row)">驳回</el-button>
              <el-button type="primary" size="small" @click="clickDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

      </el-tab-pane>
      <el-tab-pane :label="tabMapOptions[1].label" :name="tabMapOptions[1].key">
        <tip />
        <div class="filter-container" style="margin-bottom: 10px;">
          <el-input v-model="fliterQuery.query" placeholder="订单ID/发起人" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="fliterQuery.type" placeholder="申诉类型" clearable style="width: 140px" class="filter-item">
            <el-option v-for="item in AppealeType" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>

          <el-date-picker
            v-model="fliterQuery.creatDate"
            class="filter-item"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />

          <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55"
          />
          <el-table-column

            align="center"
            label="流水号"
            min-width="120"
            element-loading-text="请给我点时间！"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.merchantOrderNo }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120" align="center" label="订单ID">
            <template slot-scope="scope">
              <span>{{ scope.row.orderUuid }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="成交额" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.amount }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="申诉时间" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" class-name="status-col" label="操作" min-width="220">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleReplace(scope.row.id)">补单</el-button>
              <el-button type="primary" size="small" @click="clickDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="handleAuditBanch()">批量补单</el-button>
        </div>
        <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

      </el-tab-pane>
    </el-tabs>
    <userInfoDig :dialog-visible="showUserInfo" :user-id="showUserIfonId" :user-type="showUserIfonType" />
  </div>
</template>

<script>
import tabPane from './components/TabPane'
import tip from '@/components/Tip'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import { order_appeals_list, order_appeal_detail, order_appeal_audit, order_reorders, order_redo } from '@/api/order'
import waves from '@/directive/waves' // waves directive
import { AppealeType, AppealeStatus, AppealeResult, PriceTread } from '@/utils/enumeration'
import userInfoDig from './components/UserInfoDig'

export default {
  name: 'Tab',
  components: { tabPane, pagination, tip, userInfoDig },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '普通申诉', key: '1' },
        { label: '补单申诉', key: '2' }
      ],
      AppealeResult,
      AppealeStatus,
      AppealeType,
      PriceTread,
      activeType: '1',
      isMatch: false,
      createdTimes: 0,
      fliterQuery: {
        page: 1,
        size: 10,
        payType: undefined,
        query: undefined,
        status: undefined,
        creatDate: undefined
      },
      type: undefined,
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
      dialogVisible: false,
      editData: {},
      multipleSelection: [],
      showUserInfo: false,
      showUserIfonId: undefined,
      showUserIfonType: 0
    }
  },
  watch: {
    activeType(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },

  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeType = tab
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleTabClick(tab, event) {
      console.log('tab', tab)
      this.meta.current = 1
      this.activeType = tab.name
      const fliterQuery = {
        page: 1,
        size: 10,
        payType: undefined,
        query: undefined,
        status: undefined,
        creatDate: undefined,
        complateDate: undefined
      }
      this.fliterQuery = fliterQuery
      this.getList()
    },
    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList()
    },
    getList(meta, data) {
      const apiArr = ['', order_appeals_list, order_reorders]
      this.listLoading = true
      this.listLoading = true
      apiArr[this.activeType](meta || this.meta, data).then(res => {
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
        type: fliterQuery.type,
        payType: fliterQuery.payType,
        query: fliterQuery.query,
        status: fliterQuery.status
      }
      if (fliterQuery.creatDate) {
        data.start = this.$moment(fliterQuery.creatDate[0]).format('YYYY-MM-DD HH:mm:ss')
        data.end = this.$moment(fliterQuery.creatDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
    },
    clickDetail(data) {
      this.$router.push({ path: `/order/appeal/${data.id}`, query: { tab: this.activeType }})
      // this.getOrderDetail(data.id)
      // this.dialogVisible = true
    },
    getOrderDetail(id) {
      order_appeal_detail({ orderId: id }).then(res => {
        if (res.code === 0) {
          this.editData = res.data
        }
      })
    },
    handleAudit(data) {
      const postData = {
        adminId: this.adminId,
        id: data.id,
        resultReason: '无'
      }
      this.$confirm('申诉是否成功', '提示', {
        confirmButtonText: '申诉方胜',
        cancelButtonText: '申诉方败',
        distinguishCancelAndClose: true,
        type: 'warning'
      }).then((val) => {
        console.log('val', val)
        postData.result = true
        this.appealAudit(postData)
      }).catch((val) => {
        console.log('val', val)
        postData.result = false
        if (val === 'cancel') {
          this.$prompt('请输入失败原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            postData.resultReason = value
            this.appealAudit(postData)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消审核'
            })
          })
        }
      })
    },
    appealAudit(data) {
      console.log('data', data)
      order_appeal_audit(data).then(res => {
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
    },
    handleReplace(id) {
      this.$confirm('是否补单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((val) => {
        order_redo({ ids: id }).then(res => {
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
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleAuditBanch() {
      const data = this.multipleSelection
      var newData = []
      data.map(item => {
        newData.push(item.id)
      })
      const postIds = newData.join(',')
      console.log('postIDs', postIds)
      this.handleReplace(postIds)
    },
    showUserDetail(id, type) {
      this.showUserIfonId = id
      this.showUserIfonType = type
      this.showUserInfo = true
    }
  }

}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .appealImage{
    max-width:40px;
  }
</style>
