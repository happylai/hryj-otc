<template>
  <div class="tab-container">
    <div class="container-tip"><i class="el-icon-warning color-primary" s /> 温馨提示：系统目前代理总数为： <el-link type="primary">{{ modals.totalAgent }} 人</el-link>  | 拓展用户总数为：<el-link type="primary">{{ modals.totalB }} 人</el-link></div>
    <el-row :gutter="20">
      <el-col :span="16">
        <div>

          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">代理奖励：</el-col>
            <el-col :span="16">
              <el-input v-model="agentAward" placeholder="设置最高比例%" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
            </el-col>
          </el-row>
          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">当前奖励比：</el-col>
            <el-col :span="16">
              <span>{{ modals.agentAward }}%</span>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR" />
            <el-col :span="16">
              <el-button v-loading="loading" v-waves class="filter-item" style="width: 100px;" type="primary" @click="handleAdd">
                保存
              </el-button>
              <el-button v-waves class="filter-item" style="margin-left: 20px;width: 100px;">
                取消
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import { agent_award, agent_award_save } from '@/api/params'

export default {
  name: 'AgentAward',
  directives: { waves },
  data() {
    return {
      modals: {},
      agentAward: undefined,
      loading: false
    }
  },

  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      agent_award().then(res => {
        if (res.code === 0) {
          this.modals = res.data
        }
      })
    },
    handleAdd() {
      if (this.agentAward) {
        this.loading = true
        agent_award_save({
          id: this.modals.id,
          award: this.agentAward
        }).then(res => {
          this.loading = false

          if (res.code === 0) {
            this.getDetail()
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
      } else {
        this.$message.error('请输入代理奖励')
      }
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
