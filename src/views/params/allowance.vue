<template>
  <div class="tab-container">
    <!-- <el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" /> -->
    <el-tabs v-if="activeType!=='4'" v-model="activeType" style="margin-top:15px;" @tab-click="handleTabClick">

      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key" />
    </el-tabs>
    <!-- <tab-pane :loading="loading" :data="list" @edit="handlEdit" /> -->
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-select v-model="addData.roleId" placeholder="选择角色" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in UserType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-if="activeType==='0'||activeType==='1'||activeType==='4'" v-model="addData.payType" placeholder="支付方式" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-if="activeType==='0'" v-model="addData.counterParty" placeholder="交易方" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in CounterParty" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-if="activeType==='1'" v-model="addData.counterParty" placeholder="设置时间段" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in CounterParty" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-input v-model="addData.ratio" :placeholder="activeType==='3'?'最高返利比例%':'奖励比例%'" style="width: 180px;" class="filter-item" />
      <el-input v-model="addData.subsidyMax" placeholder="单笔限额" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" @click="handleAdd">
        确认添加
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        label="角色"
        width="120"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.roleId|userTypeName }}</span>
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

      <el-table-column align="center" label="补贴比例%">
        <template slot-scope="scope">
          <span>{{ scope.row.ratio }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="补贴限额">
        <template slot-scope="scope">
          <span>{{ scope.row.subsidyMax }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handlEdit(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>   <pagination v-show="meta.total>0" :total="meta.total" :page.sync="meta.pages" :limit.sync="meta.size" @pagination="metaChange" />

    <el-dialog :visible.sync="dialogVisible" :title="tabMapOptions[activeType].label">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">当前角色：</el-col>
        <el-col :span="16">{{ editData.roleId|userTypeName }}</el-col>
      </el-row>
      <el-row v-if="activeType=='0'||activeType=='1'" :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">支付方式：</el-col>
        <el-col :span="16">{{ editData.payType|paymentStatus }}</el-col>
      </el-row>
      <el-row v-if="activeType=='0'||activeType=='1'" :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">交易方：</el-col>
        <el-col :span="16">{{ editData.counterParty|counterParty }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">补贴比例：</el-col>
        <el-col :span="16">
          <el-input v-model="editData.newratio" style="width: 200px;height:30px" placeholder="请输入补贴比例(如:1.9)" />
          <el-link type="danger" :underline="false">当前补贴比例：{{ editData.ratio }}</el-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">补贴限额：</el-col>
        <el-col :span="16">
          <el-input v-model="editData.newsubsidyMax" style="width: 200px;height:30px" placeholder="请设置补贴限额(如:1000)" />
          <el-link type="danger" :underline="false">当前补贴限额：{{ editData.subsidyMax }}</el-link>
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

export default {
  name: 'Tab',
  components: { tabPane, pagination },
  directives: { waves },
  data() {
    return {
      UserType,
      PayType,
      CounterParty,
      tabMapOptions: [
        { label: '交易补贴', key: '0' },
        { label: '夜间补贴', key: '1' },
        { label: '达量补贴', key: '2' },
        { label: '返利补贴', key: '3' },
        { label: '交易提成', key: '4' }
      ],

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
        counterParty: undefined,
        payType: undefined,
        ratio: undefined,
        subsidyMax: undefined
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
    ...mapState({
      // allList: state => state.order.allList,
      allListMeta: state => state.order.allMeta
    })
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    const name = this.$route.name
    if (name === 'commission') {
      this.activeType = '4'
    } else if (tab) {
      this.activeType = tab
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleTabClick(tab, event) {
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
      if (!data.roleId) {
        this.$message.error('请选择角色')
      } else
      if ((this.activeType === '0' || this.activeType === '1' || this.activeType === '4') && (data.payType === '' || data.payType === undefined)) {
        this.$message.error('请选择支付方式')
      } else if ((this.activeType === '0' || this.activeType === '1') && (data.counterParty === '' || data.counterParty === undefined)) {
        this.$message.error('请选择交易方')
      } else if (!data.ratio) {
        this.$message.error('请填写奖励比例')
      } else if (!data.subsidyMax) {
        this.$message.error('请填写最高限额')
      } else {
        const postData = {
          roleId: data.roleId,
          payType: this.activeType === '0' || this.activeType === '1' || this.activeType === '4' ? data.payType : undefined,
          counterParty: this.activeType === '0' || this.activeType === '1' ? data.counterParty : undefined,
          ratio: data.ratio,
          subsidyMax: data.subsidyMax,
          type: this.activeType
        }
        this.save(postData)
      }
    },
    handleSave() {
      const data = this.editData
      const postDate = {
        id: data.id,
        roleId: data.roleId,
        payType: this.activeType === '0' || this.activeType === '1' || this.activeType === '4' ? data.payType : undefined,
        counterParty: this.activeType === '0' || this.activeType === '1' ? data.counterParty : undefined,
        ratio: data.newratio ? data.newratio : data.ratio,
        subsidyMax: data.subsidyMax ? data.newsubsidyMax : data.subsidyMax,
        type: data.type
      }
      this.save(postDate)
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
.userRow {
  min-height: 20px;
  margin: 10px 0;
}
</style>
