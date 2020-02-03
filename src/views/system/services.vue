<template>
  <div class="tab-container">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="querymeta.query" placeholder="昵称/账户/IP地址" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="querymeta.roleId" placeholder="选择权限" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in adminRolesConst" :key="item.label+'srole'" :label="item.zhName" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-plus" @click="showAddUser=true">
        添加客服
      </el-button>
    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-loading="loading" align="center" label="昵称" width="220" element-loading-text="请给我点时间！">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="180px" align="center" label="账号">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime|timestampFormat }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="状态" width="95">
      <template slot-scope="scope">
        <el-link :underline="false" :type="scope.row.orderStatus|orderStatusTagName">{{ scope.row.orderStatus|orderStatus }}</el-link>
      </template>
    </el-table-column> -->

      <el-table-column class-name="status-col" align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="clickEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="clickFreeze(scope.row.id)">冻结</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="meta.total" :page.sync="meta.pages" :limit.sync="meta.size" @pagination="paginationChange" />
    <el-dialog :visible.sync="dialogVisible" title="后台用户编辑">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">昵称：</el-col>
        <el-col :span="16">{{ editData.nickName }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">登录邮箱：</el-col>
        <el-col :span="16">{{ editData.email }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">登陆IP：</el-col>
        <el-col :span="16">
          {{ editData.ip }}
          <el-checkbox v-model="ipOnly">
            <el-link type="danger" :underline="false">是否限制改IP登录</el-link>
          </el-checkbox>
          <el-link type="primary">详情</el-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">角色：</el-col>
        <el-col :span="16">
          <el-select v-model="newRole" placeholder="更换角色">
            <el-option v-for="(item,index) in adminRolesConst" :key="index" :label="item.zhName" :value="item.id" />
          </el-select>
          <el-link type="danger" :underline="false">当前登录角色：{{ adminRolesConstName(editData.role,adminRolesConst) }}</el-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">上次登陆时间：</el-col>
        <el-col :span="16">{{ editData.createTime|timestampFormat }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="16" :offset="8">
          <el-checkbox v-model="isfreeze">
            <el-link type="danger" :underline="false">冻结该账号</el-link>
          </el-checkbox>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" saveEdit() ">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="showAddUser" title="添加客服">
      <el-form ref="regForm" :model="regForm" :rules="loginRules" class="login-form" label-width="80px" auto-complete="on" label-position="right">
        <el-form-item label="邮箱" class="addUserItem" prop="email">
          <el-input ref="email" v-model="regForm.email" autocomplete="off" placeholder="请输入邮箱" name="email" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item label="昵称" class="addUserItem" prop="nickName">
          <el-input ref="nickName" v-model="regForm.nickName" autocomplete="off" placeholder="请输入昵称" name="nickName" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item label="密码" class="addUserItem" prop="password">
          <el-input ref="password" v-model="regForm.password" autocomplete="off" show-password :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" />
        </el-form-item>
        <!-- <el-form-item label="重复密码" class="addUserItem" prop="confirm">
          <el-input ref="confirm" v-model="regForm.confirm" autocomplete="off" show-password :type="passwordType" placeholder="请重复密码" name="confirm" tabindex="2" auto-complete="on" @keyup.enter.native="handlAdd" />
        </el-form-item> -->
        <el-form-item label="" class="addUserItem">
          <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handlAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import tabPane from './components/TabPane'
import { mapState, mapGetters } from 'vuex' // 先要引入
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'
import pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { customer_service_list as listApi, customer_service_create as customerCreat, customer_detail as customer_service_detail } from '@/api/message'
import { Auths, Roles } from '@/utils/enumeration'
import { validateUsername, validateEamil, validatePassword } from '@/utils/validate'

export default {
  name: 'Tab',
  components: { tabPane, pagination },
  directives: { waves },
  data() {
    const validateConfirm = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请重复密码'))
      } else if (value.length < 6) {
        callback(new Error('密码必须大于6位数'))
      } else if (this.regForm.password !== value) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      groupsConstName,
      userRolesConstName,
      adminRolesConstName,
      SelectRoles: [{ label: '全部', id: '' }, ...Roles],
      Roles,
      Auths,
      loading: false,
      loginRules: {
        nickName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        email: [{ required: true, trigger: 'blur', validator: validateEamil }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirm: [{ required: true, trigger: 'blur', validator: validateConfirm }]
      },
      dialogVisible: false,
      showAddUser: false,
      querymeta: {
        roleId: '',
        query: ''
      },
      isfreeze: false,
      ipOnly: false,
      newAuth: '',
      newRole: '',
      editData: {
      },
      regForm: {
        nickName: '',
        email: '',
        password: ''
      },
      passwordType: 'password',
      list: []

    }
  },
  computed: {
    ...mapState({
      meta: state => state.admin.meta
    }),
    ...mapGetters([
      'groupsConst',
      'userRolesConst',
      'adminRolesConst'
    ])
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleFreeze(id) {
      freeze({ adminId: id }).then(res => {
        console.log('res', res)
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$message.error('操作失败')
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    paginationChange(e) {
      console.log('paginationChange', e)
      const data = {
        size: e.limit,
        current: e.page
      }
      this.handleFilter(data)
    },
    getList(meta, data) {
      this.listLoading = true

      listApi(meta, data || { active: true }).then(res => {
        if (res.code === 0) {
          this.list = res.data.records
        }
      })
    },
    handleFilter(data) {
      const newMeta = {
        ...this.querymeta,
        ...data,
        current: 1
      }
      // console.log('searchMeat', this.querymeta)
      this.getList(newMeta)
    },
    handleEdit(data) {
      console.log('data', data)
      this.editData = data
      this.dialogVisible = true
    },
    saveEdit() {
      const data = this.editData
      const postData = {
        id: data.id,
        email: data.email,
        nickName: data.nickName,
        password: data.password
      }

      console.log('editData', postData)
      customerCreat(postData).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.getAdmins()
          this.dialogVisible = false
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.$message.error(err || '操作失败')
      })
    },
    handlAdd() {
      console.log('click')
      this.$refs.regForm.validate(valid => {
        console.log('valid', valid)
        if (valid) {
          this.loading = true
          const data = this.regForm
          customerCreat(data).then(res => {
            this.loading = false

            if (res.code === 0) {
              this.dialogVisible = false
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.showAddUser = false
              this.getList()
              this.regForm = {
                nickName: '',
                email: '',
                password: ''
              }
            } else {
              this.$message.error(res.message || '操作失败')
            }
          }).catch(err => {
            this.loading = false
            this.$message.error(err || '操作失败')
          })
        } else {
          console.log('error submit!!')
          return false
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
.userRow {
  min-height: 20px;
  margin: 10px 0;
}

.user-title {
  width: 100px;
}
.user-input {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
}
</style>
