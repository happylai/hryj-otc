<template>
  <div class="tab-container">
  <el-tabs v-model="TimeParamsType" style="margin-top:15px;" @tab-click="handleTabClick">
      <div class="filter-container" style="margin-bottom: 10px;">
        <el-input v-model="addData.time" :placeholder="TimeParamsTypePlaceHolder[TimeParamsType]+'(分钟)'" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="addData.roleId" placeholder="选择角色" clearable style="width: 140px" class="filter-item">
          <el-option v-for="item in userRolesConst" :disabled="!addUserType[TimeParamsType].includes(item.id)" :key="item.id" :label="item.zhName" :value="item.id" />
        </el-select>

        <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" @click="handleAdd">
          确认添加
        </el-button>

      </div>
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" v-if="item.visible" :label="item.label" :name="item.key" />
    </el-tabs>
    <tab-pane :loading="loading" :data="list" @edit="handlEdit" />
    <!-- <pagination v-show="meta.total>0" :total="meta.total" :page.sync="meta.pages" :limit.sync="meta.size" @pagination="getList" /> -->

    <el-dialog :visible.sync="dialogVisible" :title="TimeParamsTypePlaceHolder[TimeParamsType]+'设置'">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">当前角色：</el-col>
        <el-col :span="16">{{ userRolesConstName(editData.roleId,userRolesConst) }} </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">倒计时：</el-col>
        <el-col :span="16">
          <el-input v-model="editData.newtime" style="width: 150px;height:30px" placeholder="请输入时间参数(如:15)" />
          <el-link type="danger" :underline="false">当前时间参数：{{ editData.time }}</el-link>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tabPane from './components/TabPane'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { UserType, TimeParamsType } from '@/utils/enumeration'
import { time_params, time_param_save } from '@/api/params'

export default {
  name: 'Tab',
  components: { tabPane, pagination },
  directives: { waves },
  data() {
    return {
      groupsConstName,
      userRolesConstName,
      adminRolesConstName,
      UserType,
      tabMapOptions: [
        { label: '买家付款超时', key: '0' ,visible:true },
        { label: '卖家确认超时', key: '1' ,visible:true},
        { label: '触发申述时间', key: '2' ,visible:false},
        { label: '解冻货币时间', key: '3' ,visible:true},
        { label: '一键接单时间', key: '4' ,visible:true}
      ],
      TimeParamsTypePlaceHolder: {
        0: '超时参数',
        1: '超时参数',
        2: '申述激活时间',
        3: '自动解冻时间',
        4: '一键接单时间'
      },
      addUserType:{
        0:[4,5,6,7,8],
        1:[4,5,6,7,8],
        3:[6,7,8],
        4:[5,6,7,8]
      },
      TimeParamsType: '0',
      loading: false,
      dialogVisible: false,
      meta: {
        current: 1,
        size: 10,
        total: 1,
        pages: 1
      },
      addData: {
        roleId: '',
        time: ''
      },
      list: [],
      editData: {
        roleId: 1
      }
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
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
    handleTabClick(tab, event) {
      this.TimeParamsType = tab.name
      this.getList()
      console.log(tab.name)
    },
    getList() {
      this.loading = true
      time_params({ type: this.TimeParamsType }).then(res => {
        console.log('res', res)
        this.loading = false
        if (res.code === 0) {
          this.list = res.data.records
        }
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handlEdit(data) {
      this.editData = data
      this.dialogVisible = true
    },
    handleSave() {
      const data = this.editData
      const postData = {
        id: data.id,
        roleId: data.roleId,
        time: data.newtime ? data.newtime * 1 : data.time * 1,
        type: data.type
      }
      this.save(postData)
    },
    handleAdd() {
      if (!this.addData.time) {
        this.$message.error('请填写超时参数')
      } else if (!this.addData.roleId) {
        this.$message.error('请选择角色')
      } else {
        const data = {
          type: this.TimeParamsType,
          roleId: this.addData.roleId,
          time: this.addData.time * 1
        }
        this.save(data)
      }
    },
    save(postData) {
      time_param_save(postData).then(res => {
        console.log('res', res)
        this.loading = false
        this.dialogVisible = false
        if (res.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.getList()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        console.log('err', err)
        this.$message.error(err || '操作失败')
        this.loading = false
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
</style>
