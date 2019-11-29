<template>
  <div class="tab-container">
    <el-tabs v-model="activeType" style="margin-top:15px;">
      <el-tab-pane :key="tabMapOptions[0].key" :label="tabMapOptions[0].label" :name="tabMapOptions[0].key">
        <div>
          <el-row :gutter="20" class="userRow">
            <el-col :span="20">
              <el-select v-model="price.token" placeholder="请选择币种" clearable style="width: 140px" class="filter-item" @change="filterChange">
                <el-option v-for="item in TokenType" :key="item.label+'tokenType'" :label="item.label" :value="item.label" />
              </el-select>
              <el-select v-model="price.fiat" placeholder="请选择法币" clearable style="width: 140px" class="filter-item" @change="filterChange">
                <el-option v-for="item in FiatType" :key="item.label+'tokenType'" :label="item.label" :value="item.label" />
              </el-select>
              <el-select v-model="price.dealType" placeholder="请选择交易角色" clearable style="width: 140px" class="filter-item" @change="filterChange">
                <el-option v-for="item in DealType" :key="item.label+'tokenType'" :label="item.label" :value="item.id" />
              </el-select>
              <el-input v-model="price.exchangeRate" clearable :placeholder="modals?'当期汇率'+modals.exchangeRate:'设置汇率'" style="width: 300px;" class="filter-item" />
              <el-button v-waves :loading="loading" class="filter-item" style="width: 100px;" type="primary" @click="handleSave">
                保存
              </el-button>
            </el-col>
            <el-col :span="4" class="textAlingC">
              <el-switch
                v-model="priceType1Active"
                inactive-color="#dcdfe6"
                active-text="激活该配置"
                @change="handleActiveType"
              />
            </el-col>
          </el-row>

        </div>
        <el-row :gutter="20" class="userRow marginT20">
          <el-col :span="24">
            <span class="price_title">接单范围</span>
            <el-link type="primary" @click="dialogVisible=true">去添加></el-link>
          </el-col>
        </el-row>

        <el-table class="marginT20" :data="list" border fit highlight-current-row>
          <el-table-column v-loading="loading" align="center" label="币种名称" width="180" element-loading-text="请给我点时间！">
            <template slot-scope="scope">
              <span>{{ scope.row.token }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="180px" align="center" label="汇率">
            <template slot-scope="scope">
              <span>{{ scope.row.exchangeRate }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="180px" align="center" label="接单范围">
            <template slot-scope="scope">
              <span>{{ scope.row.minPrice }}~{{ scope.row.maxPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="180px" align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>

          <el-table-column class-name="status-col" align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
              <el-button type="info" size="small" @click="handleDel(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :key="tabMapOptions[1].key" :label="tabMapOptions[1].label" :name="tabMapOptions[1].key">
        <el-row :gutter="20" class="userRow">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="textAlingR">
            <el-row :gutter="20" class="userRow">
              <el-col :span="24" class="textAlingC">是否激活该配置</el-col>
            </el-row>
            <el-row :gutter="20" class="userRow">
              <el-col :span="24" class="textAlingC">
                <el-radio-group v-model="priceType2Active">
                  <el-radio label="true">是</el-radio>
                  <el-radio label="false">否</el-radio>
                </el-radio-group>

              </el-col>
            </el-row>
            <el-row :gutter="20" class="userRow marginT40">
              <el-col :span="24" class="textAlingC">
                <el-button type="primary" @click="handleActiveType">保存</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
              </el-col>

            </el-row>
          </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </span>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="dialogVisible" :title="(editData.id?'修改':'添加')+'价格范围'">
      <el-row v-if="!editData.id" :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">币种：</el-col>
        <el-col :span="16">
          <el-select v-model="editData.token" placeholder="请选择币种" clearable style="width: 140px" class="filter-item">
            <el-option v-for="item in TokenType" :key="item.label+'tokenType'" :label="item.label" :value="item.label" />
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">汇率：</el-col>
        <el-col :span="16">
          当前汇率：{{ modals.exchangeRate }}
        </el-col>
      </el-row>

      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">最低接单价：</el-col>
        <el-col :span="16">
          <el-input v-model="editData.minPrice" style="width: 150px;height:30px" placeholder="最低接单价" />
          <el-link v-if="editData.id" type="danger" :underline="false">当前最低价：{{ editDataOld.minPrice }}</el-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">最高接单价：</el-col>
        <el-col :span="16">
          <el-input v-model="editData.maxPrice" style="width: 150px;height:30px" placeholder="最高接单价" />
          <el-link v-if="editData.id" type="danger" :underline="false">当前最高价：{{ editDataOld.maxPrice }}</el-link>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAdd()">保存</el-button>
        <el-button type="info" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
// import tabPane from './components/TabPane'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect, TokenType, DealType, FiatType } from '@/utils/enumeration'
import { pricings, pricing_save, pricing, groups, group_save, pricing_scopes, scope_save, scope_del } from '@/api/params'
import has from 'has-value'

export default {
  name: 'Tab',
  components: { pagination },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '固定价格', key: '0' },
        { label: '灵活价格', key: '1' }
      ],
      FiatType,
      DealType,
      activeType: '0',
      UserType,
      dialogVisible: false,
      TokenType,
      Authents: [{ id: '',
        mame: '',
        label: '请选择'
      }, ...Authents],
      Groups: [emptySelect, ...Groups],

      price: {
        token: 'PQC',
        dealType: 0,
        fiat: 'CNY',
        exchangeRate: undefined
      },
      variableActive: 'false',
      loading: false,
      priceType1Active: 'false',
      priceType2Active: false,
      list: [],
      editData: {
        maxPrice: undefined,
        minPrice: undefined
      },
      editDataOld: {
        maxPrice: undefined,
        minPrice: undefined
      }
    }
  },

  computed: {
    ...mapState({

    })
  },

  mounted() {
    this.getPriceDetail()
    this.getPriceGroups()
    this.getParamsList()
  },
  methods: {

    getPriceDetail() {
      const datas = {
        fiat: this.price.fiat,
        type: this.activeType,
        token: this.price.token,
        dealType: this.price.dealType
      }
      pricing(datas).then(res => {
        if (res.code === 0) {
          console.log('res', res)
          if (res.code === 0) {
            this.modals = res.data
            this.priceType1Active = res.data.active
            this.priceType2Active = !res.data.active
            this.getList()
          }
        }
      })
    },
    getParamsList(meta, data) {
      this.listLoading = true
      const datas = {

        type: this.activeType

      }
      pricings(datas).then(res => {
        this.paramslist = res.data.records

        console.log('res', res)
      })
    },
    getList(meta, data) {
      this.listLoading = true
      const datas = {
        pricingId: this.modals.id
      }
      pricing_scopes(datas).then(res => {
        if (res.code === 0) {
          this.list = res.data.records
          console.log('res', res)
        }
      })
    },

    getPriceGroups() {
      groups({ type: this.activeType }).then(res => {
        console.log('res', res)
      })
    },

    handleSave() {
      const price = this.price
      if (!price.exchangeRate) {
        this.$message.error('请填写汇率')
      } else {
        const data = {
          ...price,
          type: this.activeType
        }
        this.save(data)
      }
    },
    handleActiveType() {
      const active = this.activeType === '1' ? this.priceType1Active : this.priceType2Active
      const data = {
        ...this.price,
        active: active,
        type: this.activeType
      }
      this.save(data)
    },

    handleSaveAar() {
      if (this.variableActive === undefined) {
        this.$message.error('请选择是否激活')
      } else {
        const data = {
          type: this.activeType,
          active: this.variableActive
        }
        this.save(data)
      }
    },
    save(data) {
      this.loading = true
      pricing_save(data).then(res => {
        console.log('res', res)
        this.loading = false
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.loading = false

        this.$message.error(err || '操作失败')
      })
    },
    saveGroup() {
      group_save().then(res => {
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err || '操作失败')
      })
    },
    handleAdd() {
      const data = {
        ...this.editData,
        pricingId: this.modals.id
      }
      this.scopeSave(data)
    },
    filterChange() {
      const p = this.price
      console.log('filter change')
      if (p.token !== undefined && p.fiat !== undefined && p.dealType !== undefined) {
        console.log('filter change')

        this.getPriceDetail()
      }
    },
    scopeSave(data) {
      scope_save(data).then(res => {
        if (res.code === 0) {
          this.dialogVisible = false
          this.getList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err || '操作失败')
      })
    },
    edit(data) {
      const editData = {
        maxPrice: data.maxPrice,
        minPrice: data.minPrice,
        id: data.id
      }
      this.editDataOld.maxPrice = data.maxPrice
      this.editDataOld.minPrice = data.minPrice
      this.editData = editData
      this.dialogVisible = true
    },
    handleDel(id) {
      this.$confirm('是否删除该接单范围?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        scope_del({ scopeId: id }).then(res => {
          if (res.code === 0) {
            this.getList()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.message || '删除失败')
          }
        }).catch(err => {
          this.loading = false
          this.$message.error(err || '删除失败')
        })
      })
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
.price_title{
  font-size:16px
}
</style>
