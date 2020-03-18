<template>
  <div>
    <div>防拉单设置</div>
    <el-row :gutter="20">
      <el-col :span="16">
        <div>

          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">时间(分钟)：</el-col>
            <el-col :span="16">
              <el-input v-model="modals.time" placeholder="设置时间" style="width: 300px;" class="filter-item"  />
            </el-col>
          </el-row>
          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">次数：</el-col>
            <el-col :span="16">
                <el-input v-model="modals.times" placeholder="设置次数" style="width: 300px;" class="filter-item" />

            </el-col>
          </el-row>

          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR" />
            <el-col :span="16">
              <el-button v-loading="loading" v-waves class="filter-item" style="width: 100px;" type="primary" @click="save">
                保存
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { fetchList } from '@/api/article'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import { restrict_time_param,restrict_time_param_update } from '@/api/params'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },

  data() {
    return {

      modals:{
        time:'',
        times:'',
      }
    }
  },
  computed: {
    ...mapGetters([
      'groupsConst',
      'userRolesConst',
      'adminRolesConst'
    ])
  },
  created() {
    // this.getList()
  },
  mounted(){
    this.detial()
  },
  methods: {
    detial(data) {
      restrict_time_param().then(res=>{
        if(res.code===0){
          this.modals=res.data
        }
      })
    },
    save(){
      if(this.modals.time===''){
        this.$message.error( '请输入时间')
        return false
      }else if(this.modals.times==='') {
        this.$message.error('请输入次数')
        return false
      }
      restrict_time_param_update({time:this.modals.time,times:this.modals.times}).then(res=>{
        if(res.code===0){
          this.$message({ message: res.message || '操作成功', type: 'success' })

        }else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.actionLoading = true
        this.$message.error(err.message || '操作失败')
      })
    }
  }
}
</script>

