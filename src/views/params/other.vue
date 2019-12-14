<template>
  <div class="tab-container">
    <el-tabs v-model="ParamsType" style="margin-top:15px;" @tab-click="handleTabClick">
      <div class="filter-container" style="margin-bottom: 10px;">
        <!-- <el-select v-if="ParamsType!=='4'&&ParamsType!=='2'" v-model="addData.roleId" :placeholder="'选择'+roleName[ParamsType]" clearable style="width: 140px" class="filter-item">
          <el-option v-for="item in UserType" :key="item.id" :disabled="ParamsType==1&&(item.id===1||item.id===4)" :label="item.label" :value="item.id" />
        </el-select> -->
        <el-select v-if="ParamsType!=='4'&&ParamsType!=='2'&&ParamsType!=='5'" v-model="addData.roleId" :placeholder="'选择'+roleName[ParamsType]" clearable style="width: 140px" class="filter-item">
          <el-option
            v-for="item in
              [{
                zhName: '信任大宗',
                id: -1
              },...userRolesConst]
            "
            :key="item.id"
            :disabled="!addUserType[ParamsType].includes(item.id)"
            :label="item.zhName"
            :value="item.id"
          />
        </el-select>
        <el-input v-model="addData.addNewData" :placeholder="ParamsTypePlaceHolder[ParamsType]" style="width: 200px;" class="filter-item" />

        <el-input v-show="ParamsType==='2'" v-model="addData.minVolume" placeholder="达标交易量(如：300000)" style="width: 200px;" class="filter-item" />

        <el-input v-show="ParamsType==='5'" v-model="addData.downUrl" placeholder="下载链接" style="width: 200px;" class="filter-item" />
        <el-input v-show="ParamsType==='5'" v-model="addData.versionDesc" type="textarea" :rows="3" placeholder="版本描述" style="width: 320px;" class="filter-item" />

        <!-- <el-link v-show="ParamsType==='2'" type="danger" :underline="false">*交易量达标系统自动退还</el-link> -->

        <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" @click="handleAdd">
          确认添加
        </el-button>

      </div>
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key" />
    </el-tabs>
    <!-- <tab-pane :loading="loading" :data="list" @edit="handlEdit" /> -->
    <el-row v-if="ParamsType==='4'" :gutter="20" class="tableRow">
      <el-col :span="8" class="textAlingR">
        <el-table ref="groupsTable" v-loading="loading" :data="list" border fit highlight-current-row style="width: 800px" @current-change="handleCurrentChange">
          <el-table-column align="center" label="分组名称" width="100" element-loading-text="请给我点时间！">
            <template slot-scope="scope">
              <span>{{ scope.row.groupName }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="180px" align="center" label="分组人数">
            <template slot-scope="scope">
              <span>{{ scope.row.userNum }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="1">
        <span>>></span>
      </el-col>
      <el-col :span="17">
        <el-table v-loading="loading" :data="groupDetail" border fit highlight-current-row>
          <el-table-column align="center" label="币种名称" width="100" element-loading-text="请给我点时间！">
            <template slot-scope="scope">
              <span>{{ scope.row.token }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="180px" align="center" label="接单范围">
            <template slot-scope="scope">
              <span>{{ scope.row.minPrice }}~{{ scope.row.maxPrice }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="180px" align="center" label="法定货币">
            <template slot-scope="scope">
              <span>{{ scope.row.fiat }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="180px" align="center" label="交易角色">
            <template slot-scope="scope">
              <span>{{ scope.row.dealType|counterParty }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="groupDialogVisible=true">编辑</el-button>
        </div>
      </el-col>
    </el-row>

    <el-table v-else v-loading="loading" :data="list" border fit highlight-current-row style="width: 800px">
      <el-table-column v-if="ParamsType!=='4'&&ParamsType!=='2'&&ParamsType!=='5'" align="center" :label="roleName[ParamsType]" width="100" element-loading-text="请给我点时间！">
        <template slot-scope="scope">
          <span>{{ userRolesConstName(scope.row.roleId,userRolesConst) }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="ParamsType==='4'" prop="createTime" min-width="180px" align="center" label="分组人数" />

      <el-table-column v-if="ParamsType!=='4'&&ParamsType!=='5'" prop="money" min-width="180px" align="center" :label="ParamsTypePlaceHolder[ParamsType]">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="ParamsType==='2'" min-width="180px" :prop="minVolume" align="center" label="退还条件(交易量达标)">
        <template slot-scope="scope">
          <span>{{ scope.row.minVolume }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column v-if="ParamsType==='4'" width="180px" align="center" label="分组名称">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column v-if="ParamsType==='5'" prop="androidVersion" min-width="120px" align="center" label="App版本">
        <template slot-scope="scope">
          <span>{{ scope.row.androidVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="ParamsType==='5'" prop="downUrl" min-width="180px" align="center" label="下载链接">
        <template slot-scope="scope">
          <span>{{ scope.row.downUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="ParamsType==='5'" prop="versionDesc" min-width="180px" align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.versionDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="ParamsType!=='5'" class-name="status-col" align="center" label="操作" width="110">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handlEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="meta.total>0" :total="meta.total" :page.sync="meta.pages" :limit.sync="meta.size" @pagination="getList" /> -->

    <el-dialog :visible.sync="groupDialogVisible">

      <div class="dialog-content">
        <div slot="header" class="dialog-header">
          <span class="dialog_title">{{ currentGroup.groupName }}设置 </span> <span class="dialog_title_tip">该分组当前总人数 {{ currentGroup.userNum }}</span>
        </div>
        <div>

          <el-col :span="24" class="marginT20">
            <el-select v-model="currentGroupQuery.token" placeholder="请选择币种" clearable style="width: 140px" class="filter-item" @change="filterChange">
              <el-option v-for="item in TokenType" :key="item.label+'tokenType'" :label="item.label" :value="item.label" />
            </el-select>
            <el-select v-model="currentGroupQuery.fiat" placeholder="请选择法币" clearable style="width: 140px" class="filter-item" @change="filterChange">
              <el-option v-for="item in FiatType" :key="item.label+'tokenType'" :label="item.label" :value="item.label" />
            </el-select>
            <el-select v-model="currentGroupQuery.dealType" placeholder="请选择交易角色" clearable style="width: 140px" class="filter-item" @change="filterChange">
              <el-option v-for="item in DealType" :key="item.label+'tokenType'" :label="item.label" :value="item.id" />
            </el-select>
            <el-button type="primary" size="small" style="margin-left: 40px" @click="handlEdit(scope.row)">搜索</el-button>
          </el-col>

          <el-table v-loading="loading" class="marginT20" :data="current_group_scopes_add" border fit highlight-current-row @selection-change="handleCurrent_group_scopes_add">

            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column align="center" label="币种选择" width="100" element-loading-text="请给我点时间！">
              <template slot-scope="scope">
                <span>{{ scope.row.token }}</span>
              </template>
            </el-table-column>

            <el-table-column v-if="ParamsType==='4'" min-width="180px" align="center" label="接单范围">
              <template slot-scope="scope">
                <span>{{ scope.row.minPrice }}~{{ scope.row.maxPrice }}</span>
              </template>
            </el-table-column>

            <el-table-column v-if="ParamsType==='4'" min-width="180px" align="center" label="法币">
              <template slot-scope="scope">
                <span>{{ scope.row.fiat }}</span>
              </template>
            </el-table-column>

            <el-table-column v-if="ParamsType==='4'" min-width="180px" align="center" label="交易角色">
              <template slot-scope="scope">
                <span>{{ scope.row.dealType }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" class="marginT20" @click="handleAddGroupScopes()">一键添加</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" :title="ParamsTypePlaceHolder[ParamsType]+'设置'">
      <el-row v-if="ParamsType!=='2'" :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">{{ ParamsType===1?'升级角色':'当前角色' }}：</el-col>
        <el-col :span="16">{{ userRolesConstName(editData.roleId,userRolesConst) }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">{{ ParamsTypePlaceHolder[ParamsType] }}：</el-col>
        <el-col :span="16">
          <el-input v-model="editData.newData" style="width: 150px;height:30px" :placeholder="`请输入${ParamsTypePlaceHolder[ParamsType]}参数(如:15)`" />
          <el-link type="danger" :underline="false">当前{{ ParamsTypePlaceHolder[ParamsType] }}参数： <span>{{ editData.money }}</span>
            <!-- <span v-if="ParamsType==2">{{ editData.activeGold }}</span>
            <span v-if="ParamsType==3">{{ editData.num }}</span></el-link> -->
          </el-link></el-col>
      </el-row>
      <el-row v-if="ParamsType==='2'" :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">达标交易量：</el-col>
        <el-col :span="16">
          <el-input v-model="editData.newminVolume" style="width: 150px;height:30px" :placeholder="`请输入达标交易量`" />
          <el-link type="danger" :underline="false">当前达标交易量参数： <span>{{ editData.minVolume }}</span>

          </el-link></el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-loading="loading" type="primary" @click="handleSave">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    </el-table></div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { TokenType, FiatType, DealType } from '@/utils/enumeration'
import { deposits, deposit_save, active_golds, active_gold_save, cancel_nums, cancel_num_save, groups, group_save, groups_scopes, get_group_scopes_add, scopes_add, app_version_save, app_versions } from '@/api/params'
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'
export default {
  name: 'Tab',
  components: { pagination },
  directives: { waves },
  data() {
    return {
      userRolesConstName,
      TokenType,
      FiatType,
      DealType,
      tabMapOptions: [
        { label: '保证金', key: '1', name: 'deposit' },
        { label: '激活金', key: '2', mame: 'activeGold' },
        { label: '每日可取消单数', key: '3', name: 'num' },
        { label: '分组设置', key: '4', name: 'num' },
        { label: '系统版本', key: '5', name: 'version' }

      ],
      addUserType: {
        1: [5, 6, 7, -1, 8],
        3: [4, 5, 6, 7, 8]
      },
      ParamsTypePlaceHolder: {
        1: '保证金',
        2: '激活金',
        3: '每日可取消单数',
        4: '分组名称',
        5: 'APP系统版本'

      },
      roleName: ['', '升级角色', '角色', '角色', '角色'],
      currentGroup: { groupName: undefined },
      tabValueName: ['', 'deposit', 'activeGold', '', 'num'],
      ParamsType: '1',
      loading: false,
      dialogVisible: false,
      groupDialogVisible: false,
      meta: {
        current: 1,
        size: 10,
        total: 1,
        pages: 1
      },
      addData: {
        roleId: '',
        addNewData: '',
        androidVersion: undefined,
        versionDesc: undefined,
        downUrl: undefined
      },
      list: [{

      }],
      groupDetail: [],
      editData: {
        roleId: 1
      },
      editDataQuery: {

      },
      currentGroupQuery: {
        token: 'BTC',
        dealType: 0,
        fiat: 'CNY'
      },
      current_group_scopes_add: [],
      current_group_scopes_add_Selection: []
    }
  },
  computed: {
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
    setCurrent(row) {
      console.log('setRow', row)
      this.currentGroup = row
      this.$refs.groupsTable.setCurrentRow(row)
    },
    handleCurrentChange(data) {
      console.log('val', data)
      this.currentGroup = data
      this.getGroupDetail(data.id)
    },
    handleCurrent_group_scopes_add(val) {
      console.log('handleCurrent_group_scopes_add', val)
      this.current_group_scopes_add_Selection = val
    },
    handleTabClick(tab, event) {
      this.ParamsType = tab.name
      this.addData = {
        roleId: undefined,
        addNewData: undefined
      }
      this.getList()
      console.log(tab.name)
    },
    getList() {
      this.loading = true
      const apiList = ['', deposits, active_golds, cancel_nums, groups, app_versions]
      apiList[this.ParamsType]().then(res => {
        console.log('res', res)
        this.loading = false
        if (res.code === 0) {
          this.list = res.data.records
          if (this.ParamsType === '4') {
            this.getGroupDetail(this.list[0].id)
            this.setCurrent(this.list[0])
          }
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
      if (this.ParamsType !== '4') {
        this.editData = data
        this.dialogVisible = true
      } else {
        this.editData = data
        this.groupDialogVisible = true
      }
    },
    getGroupDetail(id) {
      groups_scopes({ groupId: id }).then(res => {
        this.groupDetail = res.data.records
      })
    },
    getgroup_scopes_add() {
      const data = {
        ...this.currentGroupQuery,
        groupId: this.currentGroup.id
      }
      get_group_scopes_add(data).then(res => {
        if (res.code === 0) {
          this.current_group_scopes_add = res.data.records
        }
      })
    },
    handleSave() {
      var data = this.editData
      const postData = {
        id: data.id,
        roleId: data.roleId,
        money: data.newData * 1,
        minVolume: this.ParamsType === '2' ? data.newminVolume : undefined,
        type: data.type
      }
      this.save(postData)
    },
    handleAdd() {
      if (!this.addData.roleId && (this.ParamsType === '1' || this.ParamsType === '3')) {
        this.$message.error(`请选择${this.roleName[this.ParamsType]}`)
      } else if (!this.addData.addNewData) {
        this.$message.error(`请填写${this.ParamsTypePlaceHolder[this.ParamsType]}`)
      } else if (this.ParamsType === '4') {
        const data = {
          groupName: this.addData.addNewData
        }
        this.save(data)
      } else if (!this.addData.roleId && this.ParamsType !== '2' && this.ParamsType !== '5') {
        this.$message.error('请选择角色')
      } else if (this.ParamsType === '5' && !this.addData.downUrl) {
        this.$message.error('请填写下载URl')
      } else if (this.ParamsType === '5' && !this.addData.versionDesc) {
        this.$message.error('请填写版本描述')
      } else {
        var data = {
          roleId: this.addData.roleId,
          type: this.ParamsType,
          money: this.addData.addNewData
        }
        if (this.ParamsType === '2') {
          if (!this.addData.minVolume) { this.$message.error('请填写达标交易量'); return false } else {
            data.minVolume = this.addData.minVolume
          }
        }
        if (this.ParamsType === '5') {
          data = {
            androidVersion: this.addData.addNewData,
            downUrl: this.addData.downUrl,
            versionDesc: this.addData.versionDesc
          }
        }
        console.log('data', data)
        this.save(data)
      }
    },
    save(postData) {
      const apiList = ['', deposit_save, active_gold_save, cancel_num_save, group_save, app_version_save]
      apiList[this.ParamsType](postData).then(res => {
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
    },
    filterChange() {
      this.getgroup_scopes_add(this.currentGroupQuery)
    },
    handleAddGroupScopes() {
      const data = this.current_group_scopes_add_Selection
      var result = data.map(a => a.id).join(',')
      const postData = {
        groupId: this.currentGroup.id,
        scopeIds: result
      }
      if (result) {
        scopes_add(postData).then(res => {
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
      console.log('result', result)
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 20px;
}
.tableRow {
  min-height: 20px;
  margin: 10px 0;
  display: flex
}
.dialog-header{
  margin-top:-50px;
  margin-left:-20px
}
.dialog_title{
  font-size:24px;
  font-weight:bold
}
.dialog_title_tip{
  margin-left:20px;
  font-size:14px
}
.dialog-content{
  margin:10px 20px
}
.dialog_content_top{
  padding-top:40px;
  margin-bottom:20px
}
</style>
