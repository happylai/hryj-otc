<template>
  <div class="tab-container">
    <!-- <el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" /> -->
    <el-tabs v-model="ParamsType" style="margin-top:15px;" @tab-click="handleTabClick">
      <div class="filter-container" style="margin-bottom: 10px;">
        <el-select v-if="ParamsType!=='4'" v-model="addData.roleId" placeholder="选择角色" clearable style="width: 140px" class="filter-item">
          <el-option v-for="item in UserType" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
        <el-input v-model="addData.addNewData" :placeholder="ParamsTypePlaceHolder[ParamsType]" style="width: 200px;" class="filter-item" />

        <el-input v-show="ParamsType==='2'" v-model="addData.minVolume" placeholder="达标交易了(如：300000)" style="width: 200px;" class="filter-item" />
        <el-link v-show="ParamsType==='2'" type="danger" :underline="false">*交易量达标系统自动退还</el-link>

        <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" @click="handleAdd">
          确认添加
        </el-button>

      </div>
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key" />
    </el-tabs>
    <!-- <tab-pane :loading="loading" :data="list" @edit="handlEdit" /> -->
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 800px">
      <el-table-column v-if="ParamsType!=='4'" align="center" label="角色" width="100" element-loading-text="请给我点时间！">
        <template slot-scope="scope">
          <span>{{ scope.row.roleId|userTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="ParamsType==='4'" min-width="180px" align="center" label="分组人数">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="ParamsType!=='4'" min-width="180px" align="center" :label="ParamsTypePlaceHolder[ParamsType]">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>

        </template>
      </el-table-column>

      <el-table-column v-if="ParamsType==='2'" min-width="180px" align="center" label="退还条件(交易量达标)">
        <template slot-scope="scope">
          <span>{{ scope.row.minVolume }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="ParamsType==='4'" width="180px" align="center" label="分组名称">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="ParamsType==='4'" width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.userNum }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="操作" width="110">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handlEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="meta.total>0" :total="meta.total" :page.sync="meta.pages" :limit.sync="meta.size" @pagination="getList" /> -->

    <el-dialog :visible.sync="groupDialogVisible" >

      <div class="dialog-content">
        <div slot="header" class="dialog-header">
          <span class="dialog_title">分组1设置 </span> <span class="dialog_title_tip">该分组当前总人数 33567</span>
        </div>
        <div>
          <el-row :gutter="20" class="dialog_content_top">
            <el-col :span="24" class="">
              <el-select  v-model="addData.roleId" placeholder="选择币种" clearable style="width: 140px" class="filter-item">
                  <el-option v-for="item in UserType" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
                <el-select  v-model="addData.roleId" placeholder="接单范围" clearable style="width: 140px" class="filter-item">
                  <el-option v-for="item in UserType" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
                <el-button type="primary" size="small" style="margin-left: 40px" @click="handlEdit(scope.row)">确认添加</el-button>
            </el-col>
          </el-row>

          <el-table v-loading="loading" :data="list" border fit highlight-current-row >
            <el-table-column  align="center" label="币种选择" width="100" element-loading-text="请给我点时间！">
              <template slot-scope="scope">
                <span>{{ scope.row.roleId|userTypeName }}</span>
              </template>
            </el-table-column>

            <el-table-column v-if="ParamsType==='4'" min-width="180px" align="center" label="接单范围">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column v-if="ParamsType==='4'" min-width="180px" align="center" label="分组人数">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column v-if="ParamsType==='4'" min-width="180px" align="center" label="创建时间">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>


            <el-table-column class-name="status-col" align="center" label="操作" width="110">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="handlEdit(scope.row)">解散</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" :title="ParamsTypePlaceHolder[ParamsType]+'设置'">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">当前角色：</el-col>
        <el-col :span="16">{{ editData.roleId|userTypeName }}</el-col>
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
      <span slot="footer" class="dialog-footer">
        <el-button v-loading="loading" type="primary" @click="handleSave">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { UserType, TimeParamsType } from '@/utils/enumeration'
import { deposits, deposit_save, active_golds, active_gold_save, cancel_nums, cancel_num_save, groups, group_save } from '@/api/params'

export default {
  name: 'Tab',
  components: { pagination },
  directives: { waves },
  data() {
    return {
      UserType,
      tabMapOptions: [
        { label: '保证金', key: '1', name: 'deposit' },
        { label: '激活金', key: '2', mame: 'activeGold' },
        { label: '每日可取消单数', key: '3', name: 'num' },
        { label: '分组设置', key: '4', name: 'num' }

      ],
      ParamsTypePlaceHolder: {
        1: '保证金',
        2: '激活金',
        3: '每日可取消单数',
        4: '分组名称'

      },
      tabValueName: ['', 'deposit', 'activeGold', '', 'num'],
      ParamsType: '4',
      loading: false,
      dialogVisible: false,
      groupDialogVisible:true,
      meta: {
        current: 1,
        size: 10,
        total: 1,
        pages: 1
      },
      addData: {
        roleId: '',
        addNewData: ''
      },
      list: [{

      }],
      editData: {
        roleId: 1
      }
    }
  },
  computed: {
    ...mapState({
      // allList: state => state.order.allList,
      allListMeta: state => state.order.allMeta
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
    this.getList()
  },
  methods: {
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
      const apiList = ['', deposits, active_golds, cancel_nums, groups]
      apiList[this.ParamsType]().then(res => {
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
      if(this.ParamsType!=='4'){
      this.editData = data
      this.dialogVisible = true
      }else{
        this.editData = data
        this.groupDialogVisible = true
      }
    },
    getGroupDetail(id){

    },
    handleSave() {
      const data = this.editData
      const postData = {
        id: data.id,
        roleId: data.roleId,
        money: data.newData * 1,
        type: data.type
      }
      this.save(postData)
    },
    handleAdd() {
      if (!this.addData.addNewData) {
        this.$message.error(`请填写${this.ParamsTypePlaceHolder[this.ParamsType]}`)
      } else if (this.ParamsType === '4') {
        const data = {
          groupName: this.addData.addNewData
        }
        this.save(data)
      } else if (!this.addData.roleId) {
        this.$message.error('请选择角色')
      } else {
        const data = {
          roleId: this.addData.roleId,
          type: this.ParamsType,
          money: this.addData.addNewData
        }
        if (this.ParamsType === '2') {
          if (!this.addData.minVolume) { this.$message.error('请填写达标交易量'); return false } else {
            data.minVolume = this.addData.minVolume
          }
        }
        console.log('data', data)
        this.save(data)
      }
    },
    save(postData) {
      const apiList = ['', deposit_save, active_gold_save, cancel_num_save, group_save]
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
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 20px;
}
.userRow {
  min-height: 20px;
  margin: 10px 0;
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
