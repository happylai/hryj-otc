<template>
  <div class="tab-container">

    <el-card class="box-card marginT20">
      <div slot="header" class=" cardHeader">
        <span class="card-title">通道列表</span>
        <div class="cardHeaderRight">
          <span style=" margin-right:10px">托底通道总开关</span>
          <el-switch
            v-model="mainSwitch"
            active-color="#13ce66"
            inactive-color="#dcdfe6"
            @change="handleChangeMainStatus()"
          />
          <!-- <el-button style=" margin-left:10px" size="small" @click="dialogVisibleWithdraw=true">刷新</el-button> -->

        </div>
      </div>
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column
          v-loading="loading"
          align="center"
          label="通道编号"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.channelCode }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="通道名称" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.channelName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="对应账号" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否启用" min-width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#dcdfe6"
              @change="handleChangeStatus(scope.row,scope.row.status)"
            />
            <!-- <span>{{ scope.row.status }}</span> -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="showDiag(scope.row)">设置付款方式</el-button>
            <!-- <span>{{ scope.row.systemSubsidy }}</span> -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card marginT20 soreWarp">
      <div slot="header" class=" cardHeader">
        <span class="card-title">通道排序</span>
        <div class="cardHeaderRight">

          <el-button v-if="deopabled" style=" margin-left:10px" size="small" type="primary" @click="handleSaveSore()">保存排序</el-button>

          <el-button v-else style=" margin-left:10px" size="small" @click="rowDrop()">启用排序</el-button>

        </div>
      </div>
      <el-select v-model="payType" placeholder="支付方式" style="width: 140px;margin-bottom:20px" class="filter-item" @change="getPayTypeSort">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-table
        :data="payTypelist"
        :default-sort="{prop: 'order', order: 'ascending'}"
        border
        fit
        sortable="custom"
        highlight-current-row
        style="width: 100%"
      >

        <!-- <el-table-column
          v-for="(item, index) in col"
          :key="`col_${index}`"
          show-overflow-tooltip
          :prop="col[index].prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <p>{{ scope.row[item.prop] }}</p>
          </template>
        </el-table-column> -->

        <el-table-column
          v-loading="payTypeLoading"
          align="center"
          label="通道编号"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.channelCode }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="通道名称" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.channelName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="当前排序" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.order }}</span>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="最新排序"
          align="center"
          width="120"
        />
        <!-- <el-table-column align="center" label="当前排序" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.order }}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="通道启用状态" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.status?'启用中':'已关闭' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款方式启用状态" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.usage?'启用中':'已关闭' }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="启用状态" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.status?'启用中':'已关闭' }}</span>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" title="设置付款方式">
      <el-form ref="rechargeForm" class="login-form" label-width="120px" auto-complete="on" label-position="right">
        <el-form-item label="通道编号" class="addUserItem" prop="uuid">
          <span>{{ currentDig.channelCode }}</span>
        </el-form-item>
        <el-form-item label="通道名称：" class="addUserItem" prop="amount">
          <span>{{ currentDig.channelName }}</span>

        </el-form-item>
        <el-form-item label="付款方式：" class="addUserItem" prop="remark">
          <el-checkbox v-model="currentDig.useAlipay">支付宝</el-checkbox>
          <el-checkbox v-model="currentDig.useWeixin">微信</el-checkbox>
          <el-checkbox v-model="currentDig.useBank">银行卡</el-checkbox>
          <el-checkbox v-model="currentDig.useCloud">云闪付</el-checkbox>
        </el-form-item>
        <el-form-item label="" class="addUserItem">
          <el-button :loading="loading" type="" @click.native.prevent="">取消</el-button>
          <el-button :loading="loading" type="primary" style="" @click.native.prevent="handlSavePaytypes">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import waves from '@/directive/waves' // waves directive
import { channels as listApi, main_switch, switchChannle, sort_save,
  pay_type_sort, save, pay_type } from '@/api/thirdChannle'
import { PayType } from '@/utils/enumeration'

export default {
  name: 'ThirdChannleCenter',
  components: { Sortable },
  directives: { waves },
  data() {
    return {
      PayType,
      loading: false,
      list: [],
      meta: {
        total: 10,
        pages: 1
      },
      mainSwitch: false,
      currentDig: {},
      dialogVisible: false,
      actionLoading: false,
      payTypeLoading: false,
      payType: 0,
      payTypelist: [],
      newpayTypelist: [],
      col: [
        {
          label: '通道名称编号',
          prop: 'channelCode'
        },
        {
          label: '通道名称',
          prop: 'channelName'
        },
        // {
        //   label: '当前排序',
        //   prop: 'order'
        // },
        {
          label: '启用状态',
          prop: 'status'
        }

      ],
      rootDepart: {
        sortableObj: undefined
      },
      deopabled: false
    }
  },

  computed: {

  },

  mounted() {
    this.getList()
    this.getPayTypeSort()
  },
  methods: {
    rowDrop() {
      const tbody = document.querySelector('.soreWarp .el-table__body-wrapper tbody')
      console.log('tbody', tbody)
      this.rootDepart.sortableObj = Sortable.create(tbody, {
        onEnd: evt => {
          console.log('evt', evt)
          var data = [...this.newpayTypelist]
          if (evt.oldIndex !== evt.newIndex) {
            const oldItem = data[evt.oldIndex]
            data.splice(evt.oldIndex, 1)
            const addIndex = evt.newIndex > evt.oldIndex ? evt.newIndex : evt.newIndex
            console.log('懂了', addIndex)

            // if()
            data.splice(addIndex, 0, oldItem)
            console.log('data', data)
            this.newpayTypelist = data
            this.payTypelist = []

            setTimeout(() => {
              this.payTypelist = data
            }, 100)
          }
        }
      }
      )
      this.deopabled = true
    },
    destroyDrop() {
      this.deopabled = false

      this.rootDepart.sortableObj.destroy()
    },
    handleSaveSore() {
      const data = []
      this.payTypelist.map((item, index) => {
        const items = {
          'id': item.id,
          'sort': index + 1
        }
        data.push(items)
      })
      const postData = {
        'payType': this.payType,
        sortList: data
      }
      sort_save(postData).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.destroyDrop()
          this.getPayTypeSort()
        } else {
          this.$message.error(res.message || '修改失败')
        }
      }).then(err => {
        this.$message.error(err.message || '修改失败')
      })
    },
    getList(meta, data) {
      this.loading = true
      listApi(meta || this.meta, data || { type: this.type }).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.mainSwitch = res.data.mainSwitch
          const channle = res.data.channels
          this.list = channle.records
          this.meta.current = channle.current
          this.meta.total = channle.total
          this.meta.pages = channle.pages
        }
      }).catch(() => {
        this.loading = false
      })
    },
    getPayTypeSort() {
      this.payTypeLoading = true
      pay_type_sort({ current: 1, size: 10 }, { payType: this.payType }).then(res => {
        this.payTypeLoading = false
        if (res.code === 0) {
          this.payTypelist = res.data.records
          this.newpayTypelist = res.data.records
        }
      }).catch(() => {
        this.payTypeLoading = false
      })
    },
    handleChangeStatus(data, status) {
      this.loading = true
      switchChannle({ id: data.id, status: status }).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.$message({
            message: '切换成功',
            type: 'success'
          })
        }
      }).catch(() => {
        this.loading = false
        this.getList()
      })
    },
    handleChangeMainStatus(status) {
      this.loading = true
      main_switch({ mainSwitch: this.mainSwitch }).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.$message({
            message: '切换成功',
            type: 'success'
          })
        }
      }).catch(() => {
        this.loading = false
        this.getList()
      })
    },
    showDiag(data) {
      this.currentDig = data
      this.dialogVisible = true
    },
    handlSavePaytypes() {
      this.actionLoading = true
      const data = {
        ...this.currentDig,
        status: undefined
      }
      pay_type(data).then(res => {
        this.actionLoading = false
        if (res.code === 0) {
          this.dialogVisible = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.getList()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(() => {
        this.$message.error(res.message || '操作失败')
        this.actionLoading = false
      })
    }

    // handlRecharge() {
    //   this.$refs.rechargeForm.validate((valid) => {
    //     if (valid) {
    //       system_central_recharge(this.recharge).then(res => {
    //         this.dialogVisibleRecharge = false,

    //         this.$message({
    //           message: '操作成功',
    //           type: 'success'
    //         })
    //       })
    //     }
    //   })
    // }

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
.card-title{
  font-weight: bold;
  font-size: 16px
}
.card-row{
  margin: 40px 0;
}
.marginT20{
  margin-top: 20px
}
.card-item{
  height: 100px;
  margin: 0 20px;
}
.borderR{
  border-right: 1px solid #ccc;

}
.cart-i-t{
  font-size: 14px
}
.cart-i-v{
  height: 60px;
  line-height: 60px;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  text-indent: -30px;
}
.userRow {
  min-height: 20px;
  margin: 10px 0;
}
.cardHeader{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cardHeaderRight{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
