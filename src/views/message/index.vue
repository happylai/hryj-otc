<template>
  <div class="tab-container">
    <el-tabs v-model="activeType" style="margin-top:15px;">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key" />
      <tip />
      <div class="filter-container" style="margin-bottom: 10px;">
        <el-input v-model="fliterQuery.query" placeholder="用户ID/姓名" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />

        <el-date-picker
          v-model="fliterQuery.date"
          class="filter-item"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
      <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column
          align="center"
          label="用ID"
          min-width="140"
          prop="uuid"
          element-loading-text="请给我点时间！"
        />
        <el-table-column align="center" class-name="status-col" prop="nickName" label="姓名" min-width="120" />
        <el-table-column align="center" class-name="status-col" label="内容" min-width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.latestMessage.messageType==='TextMessage'">{{ scope.row.latestMessage.content.content }}</span>
            <img v-else v-lazy="scope.row.message" :preview="'chat'+scope.row.id" class="chatListImage">
          </template>
        </el-table-column>
        <el-table-column align="center" class-name="status-col" label="时间" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.sentTime|timestampFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" class-name="status-col" label="操作" min-width="80" style="padding:28px 0">
          <template slot-scope="scope">
            <div style="padding-top:10px">
              <el-badge :value="scope.row.unreadMessageCount" class="item">
                <el-button type="primary" size="small" @click="clickDetail(scope.row)">回复</el-button>
              </el-badge>
            </div>

          </template>
        </el-table-column>
      </el-table>
    </el-tabs>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

  </div>
</template>

<script>
import tip from '@/components/Tip'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'

import { message_list, message_detail, message_reply } from '@/api/message'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, PayType, OrderStatus, CounterParty } from '@/utils/enumeration'
import { init } from '@/utils/rongcloudutils.js'
export default {
  name: 'Tab',
  components: { tip, pagination },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '待回复', key: '1' }
      ],
      CounterParty,
      OrderStatus,
      PayType,
      UserType,
      Authents,
      Groups,
      activeType: '1',
      isMatch: false,
      createdTimes: 0,
      fliterQuery: {
        page: 1,
        size: 10,
        date: undefined,
        query: undefined

      },
      type: undefined,
      meta: {
        current: 1,
        size: 10
      },
      loading: false,
      list: [],
      paginationMeta: {
        total: 10,
        pages: 1
      },
      dialogVisible: false,
      editData: {},
      token: 'qYfQJoOrW5dBGc952clwAeSR0DN+JyB07a25AmSQ+/9MhOnxW+0tJeJrTwftulGHb8WQPegSxXDXF3SwM3xV+clh5rknwh8h3cEEi8YesTG2buVtM/UOnQ==',
      appkey: 'p5tvi9dspqhm4', // 这是我们之前保存的 appkey *重要
      targetId: '', // 你要给谁发送消息 目标ID
      showDatas: [] // 初始化信息
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  // computed: {

  //   ...mapGetters([
  //     'token'
  //   ])
  // },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  mounted() {
    // this.getList()
    this.initRongCloud()
  },
  methods: {
    addPromptInfo(prompt, userId = null) {
      const _this = this

      const avatarList = [
        'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4100987808,2324741924&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2988245209,2476612762&fm=26&gp=0.jpg',
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=4259300811,497831842&fm=26&gp=0.jpg',
        'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3684587473,1286660191&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2884107401,3797902000&fm=26&gp=0.jpg'
      ]

      // 真实环境是通过登录 后台接口返回的 token 拿到的用户信息  我在这为为了模拟 所以给初始化后的用户随机生成一个头像
      // const avatar = avatarList[Math.floor(Math.random() * (3 + 1))]
      _this.showDatas.push(prompt)
      console.log('userid', userId)
      this.getMessageList()
      // const timer = setInterval(() => {
      //   if (userId) {
      //     clearInterval(timer) // 路由跳转后销毁定时器
      //     _this.$store.commit('SET_MEMBER', { // 保存用户信息
      //       userId: userId,
      //       avatar: avatar
      //     })
      //     _this.$store.commit('SET_TARGETID', _this.targetId) // 保存目标ID
      //     _this.$router.push({ name: 'RongCloud' })
      //   }
      // }, 500)
    },

    getMessageList() {
      const _this = this
      RongIMClient.getInstance().getConversationList({
        onSuccess: function(list) {
          console.log('list', list)
          _this.list = list
        // list => 会话列表集合
        },
        onError: function(error) {
          console.log('error', error)
        // do something
        }
      }, null)
    },

    initRongCloud() {
      var appkey = this.appkey
      var token = this.token
      if (!appkey || !token) {
        alert('appkey 和 token 不能为空')
      } else {
        // 这个init 是我们之前撸的 `utils.js`
        init({
          appkey: appkey,
          token: token
        }, this.addPromptInfo)
      }
    },

    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList()
    },
    getList(meta, data) {
      this.listLoading = true
      message_list(meta || this.meta, data).then(res => {
        console.log('res', res)
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
          this.$previewRefresh()
        }
      })
    },
    handleFilter() {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        query: fliterQuery.query
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }

      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
    },
    clickDetail(data) {
      this.$router.push({ path: `chat/${data.targetId}` })
    }

  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .chatListImage{
    max-width: 60px;
  }
</style>
