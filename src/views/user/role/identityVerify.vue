<template>
  <div>
    <tip />
    <div class="filter-container" style="margin-bottom: 10px;">

      <el-input v-model="filterQuery.query" placeholder="用户名ID/姓名/手机号" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="filterQuery.groupId" placeholder="所在分组" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in groupsConst" :key="item.id" :label="item.groupName" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="filterQuery.date"
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

    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        align="center"
        label="用户ID"
        width="170"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.userUid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="当前角色">
        <template slot-scope="scope">
          <span>{{ userRolesConstName(scope.row.currentRoleId,userRolesConst) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分组" width="100">
        <template slot-scope="scope">
          <span>{{ groupsConstName(scope.row.pricingGroupId,groupsConst) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="昵称" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="真实姓名" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.idNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证照片" width="150">
        <template slot-scope="scope">
          <img v-lazy="scope.row.identityImageFront" class="identityImage" :preview="scope.row.identityImageFront">
          <img v-lazy="scope.row.identityImageBack" class="identityImage" :preview="scope.row.identityImageBack">
          <img v-lazy="scope.row.identityImageHand" class="identityImage" :preview="scope.row.identityImageHand">
        </template>
      </el-table-column>

      <el-table-column
        align="
            center"
        label="申请时间"
        minwidth="300"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="toDetail(scope.row)">查看</el-button>
          <el-button type="primary" size="small" @click="()=>{applyId=scope.row.applyId; dialogVisible=true}">通过</el-button>
          <el-button type="primary" size="small" @click="()=>{applyId=scope.row.applyId; dialogVisible=true}">不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="paginationMeta.current" :limit.sync="meta.size" @pagination="paginationChange" />
    <el-dialog v-loading="orderLoading" :visible.sync="dialogVisible" title="提示">
      <div>是否通过该用户身份审核？</div>
      <el-row :gutter="20" class="userRow">
        <el-col :span="24"><el-input v-model="reason" placeholder="通过/不通过原因" /></el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" handleAudit(1) ">通过</el-button>
        <el-button @click="handleAudit(2)">不通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import tip from '@/components/Tip'
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, AuthType, emptySelect } from '@/utils/enumeration'
import { identity_verify_list, verify_identity } from '@/api/usermanage'
export default {
  name: 'IdentityVerify',
  components: { pagination, tip },
  directives: { waves },
  computed: {
    ...mapGetters([
      'groupsConst',
      'userRolesConst',
      'adminRolesConst'
    ])
  },
  data() {
    return {
      Groups,
      UserType,
      groupsConstName,
      userRolesConstName,
      loading: false,
      filterQuery: {
        query: null,
        groupId: null,
        date: null
      },
      meta: {
        current: 1,
        size: 10
      },
      paginationMeta: {
        pages: 1,
        total: 10
      },
      list: [],
      dialogVisible: false,
      applyId: undefined
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(meta, param) {
      this.listLoading = true
      identity_verify_list(meta, param).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
    },
    handleFilter() {
      const { query, groupId } = this.filterQuery
      const param = {}
      param.query = query
      param.groupId = groupId
      if (this.fliterQuery.date) {
        param.start = this.$moment(this.fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        param.end = this.$moment(this.fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      meta.current = 1
      this.getList(meta, param)
    },
    paginationChange(e) {
      const { query, groupId } = this.filterQuery
      const param = {}
      param.query = query
      param.groupId = groupId
      if (this.fliterQuery.date) {
        param.start = this.$moment(this.fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        param.end = this.$moment(this.fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList(this.meta, param)
    },
    toDetail(data) {
      this.$router.push(`/role/identity/${data.userId}?applyId=${data.applyId}`)
    },
    handleAudit(status) {
      if (!this.reason) {
        this.$message.error('请输入通过/不通过原因')
        return false
      }
      const data = {
        applyId: this.applyId,
        status: status,
        reason: this.reason
      }
      verify_identity(data).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.dialogVisible = false
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.$message.error(err.message || '操作失败')
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
  .identityImage{
    height: 40px;
    max-width: 100px;
  }
</style>
