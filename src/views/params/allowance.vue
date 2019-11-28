<template>
  <div class="tab-container">
    <!-- <el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" /> -->
    <el-tabs v-model="activeType" style="margin-top:15px;" @tab-click="handleTabClick">
      <el-tab-pane v-for="item in tabMapOptions" v-if="activeType<4" :key="item.key" :label="item.label" :name="item.key" />
      <el-tab-pane v-for="item in tabMapOptions1" v-if="activeType>=4" :key="item.key" :label="item.label" :name="item.key" />
    </el-tabs>
    <!-- <tab-pane :loading="loading" :data="list" @edit="handlEdit" /> -->
    <div v-if="activeType!=='3'" class="filter-container" style="margin-bottom: 10px;">
      <el-select v-if="activeType!=='5'&&activeType!=='3'&&activeType!=='4'" v-model="addData.roleId" placeholder="选择角色" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in userRolesConst" :disabled="!addUserType[activeType].includes(item.id)" :key="item.id" :label="item.zhName" :value="item.id" />
      </el-select>
      <el-select v-if="activeType!=='3'" v-model="addData.payType" placeholder="支付方式" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-if="activeType==='0'||activeType==='1'" v-model="addData.counterParty" placeholder="交易方" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in CounterParty" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-time-picker
        v-if="activeType==='1'"
        v-model="addData.date"
        is-range
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择补贴时间段"
      />
      <el-input v-if="activeType!=='3'" v-model="addData.ratio" :placeholder="ratioPlaceHolder[activeType]" style="width: 180px;" class="filter-item" />
      <el-input v-if="activeType!=='3'&&activeType==='2'" v-model="addData.achieveAmount" placeholder="达量补贴达标标准" style="width: 180px;" class="filter-item" />
      <el-input v-if="activeType==='0'||activeType==='3'" v-model="addData.levelDiffer" :placeholder="activeType==='0'?'层级差':'激活金'" style="width: 180px;" class="filter-item" />
      <el-input v-model="addData.subsidyMax" :placeholder="placeHolder[activeType]" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" @click="handleAdd">
        确认添加
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-if="activeType!=='5'&&activeType!=='3'&&activeType!=='4'"
        align="center"
        label="角色"
        width="120"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ userRolesConstName(scope.row.roleId,userRolesConst) }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="activeType!=='3'" align="center" label="支付方式" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.payType|paymentStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="activeType=='0'||activeType=='1'" width="120px" align="center" label="交易方">
        <template slot-scope="scope">
          <span>{{ scope.row.counterParty|counterParty }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="ratioPlaceHolder[activeType]">
        <template slot-scope="scope">
          <span>{{ scope.row.ratio }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="activeType=='1'" align="center" label="时间段">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}~{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="activeType=='2'" align="center" label="达量标准">
        <template slot-scope="scope">
          <span>{{ scope.row.achieveAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="activeType!=='3'" align="center" :label="placeHolder[this.activeType]">
        <template slot-scope="scope">
          <span>{{ scope.row.subsidyMax }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="activeType==='3'||activeType==='0'" align="center" :label="activeType==='0'?'层级差':'上级奖励'">
        <template slot-scope="scope">
          <span>{{ scope.row.levelDiffer||'-' }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handlEdit(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>   <pagination v-show="meta.total>0" :total="meta.total" :page.sync="meta.pages" :limit.sync="meta.size" @pagination="metaChange" />

    <el-dialog :visible.sync="dialogVisible" :title="tabMapOptionsName[activeType].label" style="min-width: 800px;">
      <el-row v-if="activeType!=='3'&&activeType!=='4'&&activeType!=='5'" :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">当前角色：</el-col>
        <el-col :span="16">{{ userRolesConstName(editData.roleId,userRolesConst)  }}</el-col>
      </el-row>
      <el-row v-if="activeType=='0'||activeType=='1'||activeType=='2'" :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">支付方式：</el-col>
        <el-col :span="16">{{ editData.payType|paymentStatus }}</el-col>
      </el-row>
      <el-row v-if="activeType=='0'||activeType=='1'" :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">交易方：</el-col>
        <el-col :span="16">{{ editData.counterParty|counterParty }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow inputRow">
        <el-col :span="8" class="textAlingR">{{ ratioPlaceHolder[activeType] }}：</el-col>
        <el-col :span="16">
          <el-input v-model="editData.newratio" style="width: 200px;height:30px" :placeholder="'请输入'+ratioPlaceHolder[activeType]+'(如:1.9)'" />
          <el-link type="danger" :underline="false">当前{{ ratioPlaceHolder[activeType] }}：{{ editData.ratio }}</el-link>
        </el-col>
      </el-row>
      <el-row v-if="activeType=='1'" :gutter="20" class="userRow inputRow">
        <el-col :span="8" class="textAlingR">补贴时间段：</el-col>
        <el-col :span="16">
          <el-time-picker
            v-model="editData.date"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择补贴时间段"
          />
          <el-link type="danger" :underline="false">当前补贴时间段：{{ editData.startTime }}~{{ editData.endTime }}</el-link>
        </el-col>
      </el-row>
      <el-row v-if="activeType=='2'" :gutter="20" class="userRow inputRow">
        <el-col :span="8" class="textAlingR">达量标准：</el-col>
        <el-col :span="16">
          <el-input v-model="editData.newachieveAmount" style="width: 200px;height:30px" placeholder="请设置达量标准" />
          <el-link type="danger" :underline="false">当前达量标准：{{ editData.achieveAmount }}</el-link>
        </el-col>
      </el-row>
      <el-row v-if="activeType!=='3'" :gutter="20" class="userRow inputRow">
        <el-col :span="8" class="textAlingR">补贴限额：</el-col>
        <el-col :span="16">
          <el-input v-model="editData.newsubsidyMax" style="width: 200px;height:30px" placeholder="请设置补贴限额(如:1000)" />
          <el-link type="danger" :underline="false">当前补贴限额：{{ editData.subsidyMax }}</el-link>
        </el-col>
      </el-row>
      <el-row v-if="activeType==='0'||activeType==='3'" :gutter="20" class="userRow inputRow">
        <el-col :span="8" class="textAlingR">{{ activeType==='0'?'层级差':'上级奖励' }}：</el-col>
        <el-col :span="16">
          <el-input v-model="editData.newlevelDiffer" style="width: 200px;height:30px" :placeholder="'请设置'+activeType==='0'?'层级差':'上级奖励'+'(如:1000)'" />
          <el-link type="danger" :underline="false">当前{{ activeType==='0'?'层级差':'上级奖励' }}：{{ editData.levelDiffer }}</el-link>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-loading="loading" type="primary" @click="handleSave">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tabPane from './components/TabPane'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { UserType, TimeParamsType, PayType, CounterParty } from '@/utils/enumeration'
import { subsidies, subsidy_save } from '@/api/params'
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'
export default {
  name: 'Tab',
  components: { tabPane, pagination },
  directives: { waves },
  data() {
    return {
      userRolesConstName,
      UserType,
      PayType,
      CounterParty,
      type: 0,
      tab1: 0,
      ratioPlaceHolder: [
        '奖励比例%', '奖励比例%', '奖励比例%', '邀请奖励', '交易提成比%', '提现手续费%'
      ],
      tabMapOptionsName: [
        { label: '交易补贴', key: '0' },
        { label: '夜间补贴', key: '1' },
        { label: '达量补贴', key: '2' },
        { label: '邀请奖励', key: '3' },
        { label: '入金手续费', key: '4' },
        { label: '出金手续费', key: '5' }
      ],
      tabMapOptions: [
        { label: '交易补贴', key: '0' },
        { label: '夜间补贴', key: '1' },
        { label: '达量补贴', key: '2' },
        { label: '邀请奖励', key: '3' }
      ],
      tabMapOptions1: [
        { label: '入金手续费', key: '4' },
        { label: '出金手续费', key: '5' }
      ],
      placeHolder: ['单笔补贴最高限额', '每天补贴最高限额', '总补贴最高限额', '补贴最高限额', '最高提成限额', '最高提成限额'],
      addUserType:{
        0:[5,6,7,8],
        1:[5,6,7,8],
        2:[5,6,7,8],




      },
      activeType: '0',
      list: [],
      loading: false,
      dialogVisible: false,
      meta: {
        current: 1,
        size: 10,
        total: 1,
        pages: 1
      },
      addData: {
        roleId: undefined,
        levelDiffer: undefined,
        counterParty: undefined,
        payType: undefined,
        ratio: undefined,
        subsidyMax: undefined,
        date: undefined,
        achieveAmount: undefined
      },
      editData: {
        roleId: 1
      }
    }
  },
  watch: {
    activeType(val) {
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

    const name = this.$route.name
    if (name === 'parameter_commission') {
      this.activeType = '4'
    } else if (tab) {
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleTabClick(tab, event) {
      this.meta.current = 1
      this.activeType = tab.name
      this.getList()
    },
    metaChange(e) {
      console.log('e', e)
      const meta = { current: e.page, size: e.limit }
      this.getList(meta)
    },
    getList(meta) {
      this.loading = true

      subsidies({ type: this.activeType }, meta || { current: this.meta.current, size: this.meta.size }).then(res => {
        console.log('res', res)
        this.loading = false
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.total = res.data.total
          this.meta.size = res.data.size
          this.meta.current = res.data.current
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
    // handleSave() {
    //   const data = this.editData
    //   const postData = {
    //     id: data.id,
    //     roleId: data.roleId,
    //     time: data.time * 1,
    //     type: data.type
    //   }
    //   this.save(postData)
    // },
    handleAdd() {
      const data = this.addData
      console.log('data', data)
      if (!data.roleId && (this.activeType !== '5' || this.activeType !== '3'|| this.activeType !== '4')) {
        this.$message.error('请选择角色')
      } else if (((data.payType === '' || data.payType === undefined) && this.activeType !== '3')) {
        this.$message.error('请选择支付方式')
      } else if (this.activeType === '1' && (data.date === '' || data.date === undefined)) {
        this.$message.error('请选择时间段')
      } else if ((this.activeType === '0' || this.activeType === '1') && (data.counterParty === '' || data.counterParty === undefined)) {
        this.$message.error('请选择交易方')
      } else if (!data.ratio) {
        this.$message.error(this.ratioPlaceHolder[this.activeType])
      } else if (this.activeType === '2' && (data.achieveAmount === '' || data.achieveAmount === undefined)) {
        this.$message.error('请填写达量标准')
      } else if ((this.activeType === '0' || this.activeType === '3') && (data.levelDiffer === '' || data.levelDiffer === undefined)) {
        this.$message.error(this.activeType === '0' ? '请填写层级差' : '上级奖励')
      } else if (this.activeType !== '3' && !data.subsidyMax) {
        this.$message.error('请填写最高限额')
      } else {
        const postData = {
          roleId: this.activeType !== '5' || this.activeType !== '3' ? data.roleId : undefined,
          levelDiffer: this.activeType === '0' || this.activeType === '3' ? data.levelDiffer : undefined,
          payType: this.activeType !== '3' ? data.payType : undefined,
          counterParty: this.activeType === '0' || this.activeType === '1' ? data.counterParty : undefined,
          ratio: data.ratio,
          subsidyMax: this.activeType !== '3' ? data.subsidyMax : undefined,
          achieveAmount: this.activeType === '2' ? data.achieveAmount : undefined,
          type: this.activeType
        }
        if (this.activeType === '1') {
          postData.startTime = this.$moment(data.date[0]).format('HH:mm:ss')
          // data.start = '2019-10-16 12:11:11'
          postData.endTime = this.$moment(data.date[1]).format('HH:mm:ss')
        }
        this.save(postData)
      }
    },
    handleSave() {
      const data = this.editData
      console.log("handleSave",data)
      const postData = {
        id: data.id,
        roleId: data.roleId,
        payType: this.activeType === '0' || this.activeType === '1' || this.activeType === '4' || this.activeType === '5' ? data.payType : undefined,
        counterParty: this.activeType === '0' || this.activeType === '1' ? data.counterParty : undefined,
        ratio: data.newratio ? data.newratio : data.ratio,
        subsidyMax: data.newsubsidyMax ? data.newsubsidyMax : data.subsidyMax,
        achieveAmount: data.newachieveAmount ? data.newachieveAmount : data.achieveAmount,
        levelDiffer: data.newlevelDiffer ? data.newlevelDiffer : data.levelDiffer,
        type: data.type
      }
      if (this.activeType === '1') {
        postData.startTime = this.$moment(data.date[0]).format('HH:mm:ss')
        // data.start = '2019-10-16 12:11:11'
        postData.endTime = this.$moment(data.date[1]).format('HH:mm:ss')
      }
      this.save(postData)
    },
    save(postData) {
      subsidy_save(postData).then(res => {
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

</style>
