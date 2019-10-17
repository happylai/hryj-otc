<template>
  <div class="tab-container">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="querymeta.query" placeholder="用户名/账户/IP地址" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="querymeta.roleId" placeholder="选择权限" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in SelectRoles" :key="item.label+'srole'" :label="item.label" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="showAddUser=true">
        添加用户
      </el-button>
    </div>
    <tab-pane :data="list" @freeze="handleFreeze" @edit="handleEdit" />
    <pagination :total="meta.total" :page.sync="meta.pages" :limit.sync="meta.size" @pagination="getAdmins" />
    <el-dialog :visible.sync="dialogVisible" title="后台用户编辑">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">用户名：</el-col>
        <el-col :span="16">{{ editData.username }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">登录邮箱：</el-col>
        <el-col :span="16">{{ editData.email }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">登陆IP：</el-col>
        <el-col :span="16" class="">
          {{ editData.ip }}
          <el-checkbox v-model="ipOnly">
            <el-link type="danger" :underline="false">是否限制改IP登录</el-link>
          </el-checkbox>
          <el-link type="primary">详情</el-link>
        </el-col>
        <el-col :span="16" />
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">角色：</el-col>
        <el-col :span="16">
          <el-select v-model="newRole" placeholder="更换角色">
            <el-option v-for="(item,index) in Roles" :key="index" :label="item.label" :value="item.id" />
          </el-select>
          <el-link type="danger" :underline="false">当前登录角色：{{ editData.role }}</el-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">权限：</el-col>
        <el-col :span="16">
          <el-select v-model="newAuth" placeholder="更换权限">
            <el-option v-for="(item,inedex) in Auths" :key="inedex+'auth'" :label="item.label" :value="item.id" />
          </el-select>
          <el-link type="danger" :underline="false">当前登录权限：{{ editData.auth }}</el-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">上次登陆时间：</el-col>
        <el-col :span="16">{{ editData.createTime }}</el-col>
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
    <el-dialog :visible.sync="showAddUser" title="添加用户">
      <el-form ref="regForm" :model="regForm" :rules="loginRules" class="login-form" label-width="80px" auto-complete="on" label-position="right">
        <el-form-item label="用户名" class="addUserItem" prop="username">
          <el-input ref="username" v-model="regForm.username" placeholder="请输入用户名" name="username" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item label="邮箱" class="addUserItem" prop="email">
          <el-input ref="email" v-model="regForm.email" placeholder="请输入邮箱" name="email" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item label="密码" class="addUserItem" prop="password">
          <el-input ref="password" v-model="regForm.password" show-password :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" />
        </el-form-item>
        <el-form-item label="重复密码" class="addUserItem" prop="repatePassword">
          <el-input ref="repatePassword" v-model="regForm.repatePassword" show-password :type="passwordType" placeholder="请重复密码" name="repatePassword" tabindex="2" auto-complete="on" @keyup.enter.native="handlAdd" />
        </el-form-item>
        <el-form-item label="" class="addUserItem">
          <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handlAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import tabPane from './components/TabPane'
import { mapState } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { freeze, save } from '@/api/admin'
import { Auths, Roles } from '@/utils/enumeration'
import { validateUsername, validateEamil, validatePassword } from '@/utils/validate'

export default {
  name: 'Tab',
  components: { tabPane, pagination },
  directives: { waves },
  data() {
    const validateRepatePassword = (rule, value, callback) => {
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
      SelectRoles: [{ label: '全部', id: '' }, ...Roles],
      Roles,
      Auths,
      loading: false,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        email: [{ required: true, trigger: 'blur', validator: validateEamil }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        repatePassword: [{ required: true, trigger: 'blur', validator: validateRepatePassword }]
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
        username: '',
        email: '',
        password: '',
        reapatPassword: ''
      },
      passwordType: 'password'

    }
  },
  computed: {
    ...mapState({
      list: state => state.admin.admins,
      meta: state => state.admin.meta
    })
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
    this.getAdmins()
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
          this.showAddUser = true
        } else {
          this.$message.error('操作失败')
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    getAdmins() {
      this.listLoading = true
      this.$store.dispatch('admin/getAdmins')
    },
    handleFilter() {
      const newMeta = {
        ...this.querymeta,
        current: 1
      }
      // console.log('searchMeat', this.querymeta)
      this.$store.dispatch('admin/changeMeta', newMeta)
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
        active: !this.isfreeze,
        ip: data.ip,
        username: data.username,
        ipOnly: this.ipOnly,
        roleIds: [this.newRole || data.role]
      }

      console.log('editData', postData)
      save(postData).then(res => {
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
          save(data).then(res => {
            this.loading = false

            if (res.code === 0) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getAdmins()
              this.regForm = {
                username: '',
                email: '',
                password: '',
                reapatPassword: ''
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
