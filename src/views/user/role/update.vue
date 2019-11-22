<template>
  <div>
    <tip />
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-button v-if="false" v-waves class="filter-item" type="primary" icon="el-icon-add" @click="handleFilter">
        新增
      </el-button>
      <el-input v-model="fliterQuery.query" placeholder="用户名ID/姓名/手机号" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.roleId" placeholder="选择角色" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in userRolesConst" :key="item.id" :label="item.zhName" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.groupId" placeholder="所在分组" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in groupsConst" :key="item.id" :label="item.groupName" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.kycLevel" placeholder="认证方式" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in KycLevel" :key="item.id" :label="item.label" :value="item.name" />
      </el-select>
      <el-date-picker
        v-model="fliterQuery.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
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
        label="用户ID"
        width="220"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="保证金">
        <template slot-scope="scope">
          <span>{{ scope.row.deposit }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="当前角色">
        <template slot-scope="scope">
          <span>{{ userRolesConstName(scope.row.currentRoleId,userRolesConst) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="认证方式" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.authType|authTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分组" width="120">
        <template slot-scope="scope">
          <span>{{ groupsConstName(scope.row.pricingGroupId,groupsConst) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收款方式" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.payTypes|payTypeNames }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请时间" minwidth="300">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="操作" width="110">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="toDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="paginationMeta.current" :limit.sync="meta.size" @pagination="paginationChange" />

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="订单详情">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
// import tabPane from './components/TabPane'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import tip from '@/components/Tip'
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect, KycLevel } from '@/utils/enumeration'
import { role_apply_list, role_apply_detail, role_apply_audit } from '@/api/usermanage'

export default {
  name: 'Tab',
  components: { pagination, tip },
  directives: { waves },
  data() {
    return {
      groupsConstName,
      userRolesConstName,
      adminRolesConstName,
      activeType: '0',
      UserType,
      KycLevel,
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
        kycLevel: undefined
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
      }
    }
  },

  computed: {
    ...mapState({
      allList: state => state.order.allList,
      allListMeta: state => state.order.allMeta
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
      role_apply_list(meta || this.meta, data || { roleStatus: this.activeType }).then(res => {
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
        kycLevel: fliterQuery.kycLevel,
        groupId: fliterQuery.groupId,
        query: fliterQuery.query,
        roleId: fliterQuery.roleId,
        roleStatus: this.activeType
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
    toDetail(data) {
      console.log('to detail')
      this.$router.push({ path: `/role/${data.id}`, query: { userId: data.userId, type: 1 }})
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
</style>
