<template>
  <div class="tab-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">基础信息</span>
        <el-button style="float: right; " type="primary" size="small" @click="clickAduit">编辑</el-button>
      </div>
      <div class="text item">
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>用户ID：{{ modals.uuid }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>真实姓名：{{ modals.realName }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>代理奖励：{{ modals.rebate }}%</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>推广人数：{{ modals.childNum }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>当前状态：<span>{{ modals.active?'正常':'冻结' }}</span></div></el-col>
        </el-row>
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>手机号：{{ modals.mobileContact }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>邮箱：{{ modals.emailContact }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>申诉数：{{ modals.appeal }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>被申诉数：{{ modals.appealed }}</div></el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card marginT40">
      <div slot="header" class="clearfix">
        <span class="card-title">用户资产（可用资产/冻结资产）</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">审核</el-button> -->
      </div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="card-item borderR">
              <div class="cart-i-t">用户资产 </div>
              <div class="cart-i-v">{{ modals.balance }}</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="card-item borderR">
              <div class="cart-i-t">冻结资产</div>
              <div class="cart-i-v">{{ modals.frozenBalance }}</div>
            </div></el-col>

        </el-row>

      </div>
    </el-card>

    <div class="section-title-container marginT40">
      <span class="section-title">收益明细</span>
    </div>
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.query" placeholder="UUID/姓名" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-date-picker class="filter-item" 
        v-model="fliterQuery.date"
        type="daterange"
        name="datepicker"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

    </div>
    <el-table stripe :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        align="center"
        label="下级ID"
        min-width="240"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.childUuid }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="B端商户">
        <template slot-scope="scope">
          <span>{{ scope.row.userBUuid }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="奖励金额">
        <template slot-scope="scope">
          <span>{{ scope.row.agencyAward }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="240px" align="center" label="奖励时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

    <div class="section-title-container marginT40">
      <span class="section-title">下级代理</span>
    </div>
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery2.query" placeholder="UUID/姓名" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-date-picker class="filter-item" 
        v-model="fliterQuery2.date"
        type="daterange"
        name="datepicker"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter2">
        搜索
      </el-button>

    </div>
    <el-table stripe :data="list2" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        prop="uuid"
        align="center"
        label="下级ID"
        min-width="240"
        element-loading-text="请给我点时间！"
      />

      <el-table-column min-width="120px" align="center" prop="rebate" label="奖励比例" />
      <el-table-column min-width="120px" align="center" prop="countB" label="B端商户数" />
      <el-table-column min-width="120px" align="center" prop="mobileContact" label="电话" />
      <el-table-column min-width="120px" align="center" prop="emailContact" label="邮箱" />
      <el-table-column min-width="120px" align="center" prop="createTime" label="注册时间" />

      <el-table-column min-width="240px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-waves class="filter-item" type="primary" @click="goAgentDetail(scope.row.id)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paginationMeta2.total>0" :total="paginationMeta2.total" :page.sync="paginationMeta2.pages" :limit.sync="meta2.size" @pagination="paginationChange2" />

    <el-dialog :visible.sync="dialogVisible" title="基础信息修改">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">用户ID：</el-col>
        <el-col :span="16">{{ editData.uuid }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">用户名：</el-col>
        <el-col :span="16">{{ editData.nickName }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">真实姓名：</el-col>
        <el-col :span="16">{{ editData.realName }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">手机号：</el-col>
        <el-col :span="16">
          {{ editData.mobileContact }}
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">登陆邮箱：</el-col>
        <el-col :span="16">{{ editData.emailContact }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">修改密码：</el-col>
        <el-col :span="16">
          <el-input v-model="newPassword" style="width: 240px" name="changepassword" type="text" placeholder="请输入密码" tabindex="2" />
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">返佣比:</el-col>
        <el-col :span="16">
          <el-input
            v-model="newData.rebate"
            placeholder="设置返佣比"
            style="width: 120px;"
            class="filter-ite"
          />
          <el-link type="danger" :underline="false">当前返佣比：{{ editData.rebate }}</el-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">账号状态：</el-col>
        <el-col :span="16">
          <el-switch
            v-model="newData.active"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />{{ newData.active?'正常':'冻结' }}
          <el-link type="danger" :underline="false">当前状态： {{ editData.active?'正常':'冻结' }}</el-link></el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" handleAudit() ">保存</el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'

import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect, OrderStatus, CounterParty, PayType } from '@/utils/enumeration'
import { agent_save, agent_detail, agent_earnings, agent_children } from '@/api/usermanage'
import { order_details } from '@/api/order'

export default {
  name: 'Tab',
  components: { pagination },
  directives: { waves },
  data() {
    return {
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
        query: undefined
      },
      fliterQuery2: {
        page: 1,
        size: 20,
        date: null,
        query: undefined
      },
      meta: {
        current: 1,
        size: 10
      },
      meta2: {
        current: 1,
        size: 10
      },
      newPassword: undefined,
      loading: false,
      loading2: false,
      list: [],
      list2: [],
      peyTypeList: [],
      paginationMeta: {
        total: 10,
        pages: 1
      },
      paginationMeta2: {
        total: 10,
        pages: 1
      },
      id: undefined,
      dialogVisible: false,
      modals: {},
      editData: {},
      newData: {
        active: false,
        payTypes: [],
        rebate: undefined,
        groupId: undefined
      }

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
    this.id = this.$route.params.id

    this.detail(this.id)
    this.getList(null, { id: this.id })
    this.getList2(null, { parent: this.id })
  },
  methods: {

    detail(id) {
      this.listLoading = true
      agent_detail({ id: id || this.id }).then(res => {
        if (res.code === 0) {
          this.modals = res.data
        }
        console.log('res')
      })
    },

    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList()
    },
    handleFilter() {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        payType: fliterQuery.payType,
        query: fliterQuery.query,
        status: fliterQuery.status,
        id: this.id
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        // data.start = '2019-10-16 12:11:11'
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
    },
    getList(meta, data) {
      agent_earnings(meta || this.meta, data || { id: this.id }).then(res => {
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
    },
    paginationChange2(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList()
    },
    handleFilter2() {
      const fliterQuery = this.fliterQuery2
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        payType: fliterQuery.payType,
        query: fliterQuery.query,
        status: fliterQuery.status,
        parent: this.id
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        // data.start = '2019-10-16 12:11:11'
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta2
      meta.current = 1
      this.getList2(meta, data)
    },
    getList2(meta, data) {
      agent_children(meta || this.meta, data || { parent: this.id }).then(res => {
        if (res.code === 0) {
          this.list2 = res.data.records
          this.meta2.current = res.data.current
          this.paginationMeta2.total = res.data.total
          this.paginationMeta2.pages = res.data.pages
        }
      })
    },
    clickAduit() {
      this.dialogVisible = true
      this.editData = this.modals
      this.newData.active = this.editData.active
      this.newData.rebate = this.editData.rebate
      this.editData.password = undefined
    },
    handleAudit() {
      const data = {
        active: this.newData.active,
        id: this.id,
        rebate: this.newData.rebate,
        password: this.newPassword ? this.newPassword : undefined
      }

      this.handle_agent_save(data)
    },
    handle_agent_save(data) {
      agent_save(data).then(res => {
        if (res.code === 0) {
          this.dialogVisible = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.detail()
        } else {
          this.$message.error('操作失败')
        }
      }).catch(err => {
        this.$message.error(err || '操作失败')
      })
    },
    goAgentDetail(id) {
      this.$router.push({ path: `/user/agent/${id}` })
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
.section-title-container{
  margin: 40px 0 20px;
}
.section-title{
  font-size: 24px;
  font-weight: bold;
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
.userRow {
  min-height: 20px;
  margin: 10px 0;
}
</style>
