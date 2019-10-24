<template>
  <div class="tab-container">
    <el-tabs v-model="activeType" style="margin-top:15px;">
      <el-tab-pane :key="tabMapOptions[0].key" :label="tabMapOptions[0].label" :name="tabMapOptions[0].key">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="">
              <el-row :gutter="20" class="userRow">
                <el-col :span="8" class="textAlingR">选择币种：</el-col>
                <el-col :span="16">
                  <el-select v-model="price.token" placeholder="请选择币种" clearable style="width: 140px" class="filter-item">
                    <el-option v-for="item in TokenType" :key="item.label+'tokenType'" :label="item.label" :value="item.label" />
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="userRow">
                <el-col :span="8" class="textAlingR">CNY：</el-col>
                <el-col :span="16">
                  <el-input v-model="price.exchangeRate" placeholder="设置汇率" style="width: 300px;" class="filter-item" />
                </el-col>
              </el-row>
              <el-row :gutter="20" class="userRow">
                <el-col :span="8" class="textAlingR">是否激活该配置？</el-col>
                <el-col :span="16" class="">
                  <el-radio v-model="price.active" label="true">是</el-radio>
                  <el-radio v-model="price.active" label="false">否</el-radio>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="userRow">
                <el-col :span="8" class="textAlingR" />
                <el-col :span="16" class="">
                  <el-button v-waves :loading="loading" class="filter-item" style="width: 100px;" type="primary" @click="handleSave">
                    保存
                  </el-button>
                  <el-button v-waves :loading="loading" class="filter-item" style="margin-left: 20px;width: 100px;">
                    取消
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane :key="tabMapOptions[1].key" :label="tabMapOptions[1].label" :name="tabMapOptions[1].key">
        <div class="filter-container" style="margin-bottom: 10px;">
          <el-input v-model="price.minVolume" placeholder="最低接单价" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="price.maxVolume" placeholder="最高接单价" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

          <el-button v-waves class="filter-item" style="margin-left: 40px;wdith:120px" type="primary" icon="el-icon-add" @click="handleFilter">
            确认添加
          </el-button>
        </div>
        <el-table :data="list" border fit highlight-current-row style="width: 800px">
          <el-table-column v-loading="loading" align="center" label="接单范围" width="180" element-loading-text="请给我点时间！">
            <template slot-scope="scope">
              <span>{{ scope.row.minVolume }} ~ {{ scope.row.maxVolume }}</span>
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
              <el-button type="info" size="small" @click="edit(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane :key="tabMapOptions[2].key" :label="tabMapOptions[2].label" :name="tabMapOptions[2].key">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="">
              <el-row :gutter="20" class="userRow">
                <el-col :span="8" class="textAlingR">是否激活该配置？</el-col>
                <el-col :span="16" class="">
                  <el-radio v-model="price.active" label="true">是</el-radio>
                  <el-radio v-model="price.active" label="false">否</el-radio>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="userRow">
                <el-col :span="8" class="textAlingR" />
                <el-col :span="16" class="">
                  <el-button v-waves :loading="loading" class="filter-item" style="width: 100px;" type="primary" @click="handleFilter">
                    保存
                  </el-button>
                  <el-button v-waves :loading="loading" class="filter-item" style="margin-left: 20px;width: 100px;">
                    取消
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

    </el-tabs>
  </div>

</template>

<script>
// import tabPane from './components/TabPane'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect, TokenType } from '@/utils/enumeration'
import { pricings, pricing_save, pricing, groups, group_save } from '@/api/params'

export default {
  name: 'Tab',
  components: { pagination },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '固定价格', key: '1' },
        { label: '价格范围', key: '2' },
        { label: '灵活价格', key: '3' }
      ],
      activeType: '1',
      UserType,
      TokenType,
      Authents: [{ id: '',
        mame: '',
        label: '请选择'
      }, ...Authents],
      Groups: [emptySelect, ...Groups],

      price: {
        active: 'false',
        token: 'PQC',
        exchangeRate: undefined
      },
      variableActive: 'false',
      loading: false,
      list: [],
      editData: {}
    }
  },

  computed: {
    ...mapState({

    })
  },

  mounted() {
    this.getPriceDetail()
    this.getList()
  },
  methods: {

    getPriceDetail() {
      pricing().then(res => {
        if (res.code === 0) {
          console.log('res', res)
          if (res.code === 0) {
          }
        }
      })
    },
    getList(meta, data) {
      this.listLoading = true
      groups({ type: this.activeType }).then(res => {
        this.list = res.data.records

        console.log('res', res)
      })
    },

    handleSave() {
      const price = this.price
      if (!price.exchangeRate) {
        this.$message.error('请填写汇率')
      } else if (price.active === undefined) {
        this.$message.error('请选择是否激活')
      } else {
        const data = {
          ...price,
          type: this.activeType
        }
      }
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
