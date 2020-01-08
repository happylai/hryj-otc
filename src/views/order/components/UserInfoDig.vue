<template>
  <el-dialog
    title="用户详情"
    :visible.sync="dialogVisible"
    width="800px"
  >
    <div v-if="userType===0" v-loading="loading" class="text item">
      <el-row :gutter="10" class="card-row">
        <el-col :span="12"><div>用户ID：{{ modals.uuid }}</div></el-col>
        <el-col :span="12"><div>用户名：{{ modals.nickName }}</div></el-col>
        <el-col :span="12"><div>当前角色：{{ userRolesConstName(modals.roleId,userRolesConst) }}</div></el-col>
        <el-col :span="12"><div>
          当前状态： <span>{{ modals.active?'正常':'冻结' }}</span></div></el-col>
        <el-col :span="12"><div>认证方式：{{ modals.authType|authTypeName }}</div></el-col>
      </el-row>
      <el-row :gutter="10" class="card-row">
        <el-col :span="12"><div>真实姓名：{{ modals.realName }}</div></el-col>
        <el-col :span="12"><div>手机号：{{ modals.mobileContact }}</div></el-col>
        <el-col :span="12"><div class="card-info-text">身份证：{{ modals.idNumber }}</div></el-col>
        <el-col :span="12"><div class="card-info-text">邮箱：{{ modals.emailContact }}</div></el-col>
      </el-row>
      <el-row :gutter="10" class="card-row">
        <el-col :span="12"><div>申诉数：{{ modals.appealNum }}</div></el-col>
        <el-col :span="12"><div>被申诉数：{{ modals.appealedNum }}</div></el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="4"><div>收付款方式：{{ modals.payTypes|payTypeNames }}</div></el-col>
        <!-- <el-col :span="12"><div >所在分组：{{ modals.pricingGroupId|groupName }}</div></el-col> -->
      </el-row>
      <el-row :gutter="10" class="card-row">
        <el-col :span="12"><div>微信：{{ modals.weixinContact }}</div></el-col>
        <el-col :span="12"><div>QQ：{{ modals.qqContact }}</div></el-col>
        <el-col :span="12"><div>支付宝：{{ modals.aliContact }}</div></el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="4"><div>Telegram：{{ modals.telegramContact }}</div></el-col>
        <!-- <el-col :span="12"><div >所在分组：{{ modals.pricingGroupId|groupName }}</div></el-col> -->
      </el-row>
      <el-row :gutter="10" class="card-row">
        <el-col :span="12"><div>可用资产{{ modals.balance }}</div></el-col>
        <el-col :span="12"><div>冻结资产(不可用)：{{ modals.frozenBalance }}</div></el-col>
        <el-col :span="12"><div class="card-info-text">保证金(不可用)：{{ modals.deposit }}</div></el-col>
        <el-col :span="12"><div class="card-info-text">激活金：{{ modals.activeBalance }}</div></el-col>
      </el-row>
    </div>
    <div v-else v-loading="loading" class="text item">
      <el-row :gutter="10" class="card-row">
        <el-col :span="12"><div>用户ID：{{ modals.uuid }}</div></el-col>
        <el-col :span="12"><div>用户名：{{ modals.nickName }}</div></el-col>
        <el-col :span="12"><div>真实姓名：{{ modals.realName }}</div></el-col>
        <el-col :span="12"><div>所属代理商：{{ modals.parentAgent||'无' }}</div></el-col>
        <el-col :span="12"><div>
          当前状态：<span>{{ modals.active?'正常':'冻结' }}</span></div></el-col>
      </el-row>
      <el-row :gutter="10" class="card-row">
        <el-col :span="12"><div>手机号：{{ modals.mobileContact }}</div></el-col>
        <el-col :span="12"><div>邮箱：{{ modals.emailContact }}</div></el-col>
        <el-col :span="12"><div>申诉数：{{ modals.appealNum }}</div></el-col>
        <el-col :span="12"><div>被申诉数：{{ modals.appealedNum }}</div></el-col>
      </el-row>
      <el-row :gutter="10" class="card-row">
        <el-col :span="12"><div>手机号：{{ modals.mobileContact }}</div></el-col>
        <el-col :span="12"><div>邮箱：{{ modals.emailContact }}</div></el-col>
        <el-col :span="12"><div>申诉数：{{ modals.appealNum }}</div></el-col>
        <el-col :span="12"><div>被申诉数：{{ modals.appealedNum }}</div></el-col>
      </el-row>
      <el-row :gutter="10" class="card-row">
        <el-col :span="12"><div>可用资产{{ modals.balance }}</div></el-col>
        <el-col :span="12"><div>冻结资产(不可用)：{{ modals.frozenBalance }}</div></el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { user_web, user_b } from '@/api/usermanage'
import { userRolesConstName } from '@/utils'

export default {
  props: {
    userId: {
      type: Number,
      default: undefined
    },
    userType: {
      type: Number,
      default: 0
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      userRolesConstName,
      modals: {},
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'userRolesConst'
    ])
  },
  watch: {
    async userId(newVal, oldVal) {
      this.detail(newVal, this.userType)
    }
  },
  methods: {
    async detail(id, type) {
      const requestType = [user_web, user_b]
      this.loading = true
      requestType[type]({ userId: id || this.id }).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.modals = res.data
        } else {
          return {}
        }
      }).catch(() => {
        this.loading = false
        return {}
      })
    }
  }
}
</script>
