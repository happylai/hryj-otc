<template>
  <div class="tab-container">
    <h2>个人中心</h2>

    <h4>基本信息</h4>
    <el-row :gutter="20">
      <el-col :span="16">
        <div>
          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">账号：</el-col>
            <el-col :span="16">
              {{ userInfo.principal.email }}
            </el-col>
          </el-row>
          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">用户名：</el-col>
            <el-col :span="16">
              {{ userInfo.principal.username }}
            </el-col>
          </el-row>
          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">当前角色：</el-col>
            <el-col :span="16">
              {{ userInfo.principal&&userInfo.principal.roleId?adminRolesConstName(userInfo.principal.roleId,adminRolesConst):null }}
              <!-- {{ adminRolesConstName((userInfo.principal?userInfo.principal.roleId:1),adminRolesConst ) }} -->
            </el-col>
          </el-row>
          <h4>安全设置</h4>

          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">邮箱账号：</el-col>
            <el-col :span="16">
              {{ userInfo.principal.email }}

            </el-col>
          </el-row>

          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">手机号码：</el-col>
            <el-col :span="16">
              {{ userInfo.principal.phone }}

            </el-col>
          </el-row>

          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">登录密码：</el-col>
            <el-col :span="16">
              <el-button size="small" :plain="true" @click="dialogVisible=true">去修改</el-button>
            </el-col>
          </el-row>

        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" width="800px" title="修改密码">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">手机号：</el-col>
        <el-col :span="16">{{ userInfo.principal.phone }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">手机验证码：</el-col>
        <el-col :span="16">
          <el-input v-model="modals.verifyCode" name="verifyCode"  style="width: 240px" type="text" placeholder="请输入手机验证码" bindex="2" />
          <el-button size="small" :loading="sendCodeLoading" :disabled="sendCodeDisabled||leftTime>0" type="primary" @click="handle_verify_send() ">{{ leftTime>0?`${leftTime} S 后重试`:`发送验证码` }}</el-button>
        </el-col>

      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">当前(旧)密码：</el-col>
        <el-col :span="16">
          <el-input v-model="modals.oldPwd" name="oldPassword" show-password style="width: 240px" type="text" placeholder="请输入当前密码" bindex="2" />
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">设置新交易密码：</el-col>
        <el-col :span="16">
          <el-input v-model="modals.newPwd" show-password style="width: 240px" type="text" placeholder="请输入新密码" bindex="2" />
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">重复密码：</el-col>
        <el-col :span="16">
          <el-input v-model="modals.confirm" show-password style="width: 240px" type="text" placeholder="请重复密码" bindex="2" />
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" :disabled="saveLoading" type="primary" @click=" handleTreadPass() ">修改密码</el-button>
        <el-button @click="treadpassDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入

import waves from '@/directive/waves' // waves directive
import { change_password, send_change_msg } from '@/api/admin'
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'
import { removeToken } from '@/utils/auth'

export default {
  name: 'AgentAward',
  directives: { waves },
  data() {
    return {
      groupsConstName,
      userRolesConstName,
      adminRolesConstName,
      modals: {},
      agentAward: undefined,
      loading: false,
      dialogVisible: false,
      saveLoading: false,
      sendCodeDisabled: false,
      sendCodeLoading: false,
      leftTime: 0
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'adminRolesConst'

    ])
  },

  mounted() {
  },
  methods: {

    handleTreadPass() {
      if (!this.modals.verifyCode) {
        this.$message.error('请输入验证码')

        return false
      } else if (!this.modals.newPwd) {
        this.$message.error('请输入旧密码')
        return false
      } else if (!this.modals.newPwd) {
        this.$message.error('请输入新密码')
        return false
      } else if (!this.modals.confirm) {
        this.$message.error('请重复密码')
        return false
      } else if (this.modals.confirm !== this.modals.newPwd) {
        this.$message.error('新密码不一致')
        return false
      }
      this.saveLoading = true
      const data = {
        ...this.modals
      }
      change_password(data).then(res => {
        this.saveLoading = false
        if (res.code === 0) {
          this.$message.success('修改密码成功')
          this.dialogVisible = false
          removeToken()
          this.$router.push('/login')
        } else {
          this.saveLoading = false
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.saveLoading = false
        this.$message.error(err || '操作失败')
      })
    },
    handle_verify_send() {
      this.sendCodeLoading = true
      send_change_msg().then(res => {
        this.sendCodeLoading = false
        if (res.code === 0) {
          this.$message.success('操作成功')
          this.leftTime = 60
          this.countDown(60)
        } else {
          this.sendCodeLoading = false
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.sendCodeLoading = false
        this.loading = false
        this.$message.error(err || '操作失败')
      })
    },
    countDown(time) {
      let left = time
      setTimeout(() => {
        left--
        console.log('left', left)
        this.leftTime = left
        time > 0 ? this.countDown(left) : null
      }, 1000)
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
