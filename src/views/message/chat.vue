<template>
  <div class="tab-container">
    <div>与{{ this.id }}对话中</div>
    <div class="chat-container">
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
            <el-tabs type="border-card">
              <el-tab-pane label="进行中的会话">
                <div v-for="(item,index) in list" :key="index+'user'" @click="changeCurrentChat(item.targetId)">
                  <el-avatar> user </el-avatar>
                  <span v-if="item.latestMessage.messageType==='TextMessage'">{{ item.latestMessage.content.content }}</span>
                  <span v-else>[图片]</span>
                </div>
              </el-tab-pane>
              <el-tab-pane label="群聊会话">
                <div v-for="(item,index) in groupList" :key="index+'user'" @click="changeCurrentChat(item.uuid)">
                  <el-avatar> {{ item.name }} </el-avatar>
                  <span>{{ item.name }}</span>
                  <span>{{ item.createTime }}</span>
                  <!-- <span v-if="item.latestMessage.messageType==='TextMessage'">{{ item.latestMessage.content.content }}</span>
                  <span v-else>[图片]</span> -->
                </div>
              </el-tab-pane>
            </el-tabs>
            <div />
          </div></el-col>

        <el-col :span="16">
          <el-dropdown>
            <span class="el-dropdown-link">
              群聊管理<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>新建群聊</el-dropdown-item>
              <el-dropdown-item>新增成员</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
          <div class="chat-history">
            <div v-for="(item,index) in chatList" :key="index" class="chat-item " :class="item.senderUserId===id?'reviced':'send' ">

              <div class="chat-item-warp">
                <div v-if="!item.senderUserId===id" class="chat-avatar ">
                  <div class="avatar">{{ (item.targetId) }}</div>
                </div>
                <div>
                  <div class="massage-time">{{ item.receivedTime|timestampFormat }}</div>
                  <div class="chat-text">
                    <span v-if="item.messageType==='TextMessage'">{{ item.content.content }}</span>

                    <img v-else v-lazy="item.message" :preview="'chat'" class="chatImage">

                  </div>

                </div>

                <div v-if="item.fromAdmin" class="chat-avatar ">
                  <div class="avatar">管理员</div>
                </div>
              </div>

            </div>
          </div>
          <div class="chat-tip">
            <div>
              <el-upload
                action="null"
                class="upload-demo"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="upload"
              >
                <i class="el-icon-picture" />
              </el-upload>
            </div>
            <div>按Enter键发送</div>
          </div>
          <div class="chat-input">
            <el-input
              v-model="chat"
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 8}"
              placeholder="请输入内容"
              @keyup.enter.native="sendText"
            />
          </div>
          <div class="chat-send">
            <el-button type="primary" @click="sendText">发送</el-button>
          </div>
        </el-col>
      </el-row>

    </div>
    <el-dialog
      title="新建群聊"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="form" :model="newGroup" label-width="80px">
        <el-form-item label="群聊名称">
          <el-input v-model="newGroup.name" />
        </el-form-item>
        <el-form-item label="客服ID">
          <el-input v-model="newGroup.id" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCreat">立即创建</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import tip from '@/components/Tip'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import { uploadImage } from '@/api/common'
import { message_detail, message_reply, chat_group_list, chat_group_create, chat_group_add_user } from '@/api/message'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, PayType, OrderStatus, CounterParty } from '@/utils/enumeration'
import { init } from '@/utils/rongcloudutils.js'

export default {
  name: 'Tab',
  components: { tip },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '待回复', key: '1' },
        { label: '已回复', key: '2' }
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
        payType: undefined,
        query: undefined,
        status: undefined,
        creatDate: undefined,
        complateDate: undefined
      },
      type: undefined,
      meta: {
        current: 1,
        size: 10
      },
      loading: false,
      list: [

      ],
      chatList: [],
      chat: undefined,
      id: 10010,
      token: 'qYfQJoOrW5dBGc952clwAeSR0DN+JyB07a25AmSQ+/9MhOnxW+0tJeJrTwftulGHb8WQPegSxXDXF3SwM3xV+clh5rknwh8h3cEEi8YesTG2buVtM/UOnQ==',
      appkey: 'p5tvi9dspqhm4', // 这是我们之前保存的 appkey *重要
      targetId: '', // 你要给谁发送消息 目标ID
      showDatas: [], // 初始化信息
      groupList: [],
      newGroup: {
        id: undefined,
        name: undefined
      },
      dialogVisible: true
    }
  },
  computed: {

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
    // this.getList()
    const id = this.$route.params.id
    this.id = id
    // this.getList(id)
    this.initRongCloud()
    this.getList()
    this.getGroupList()
  },
  methods: {
    changeCurrentChat(item) {
      console.log('item', item)
      this.id = item.targetId
    },

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
          console.log('list', list[0].targetId, list)
          _this.list = list
          if (list.length > 0 && !this.id) {
            this.id = list[0].targetId
          }
          _this.getList()
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
        }, this.addPromptInfo, this.reviceMessage)
      }
    },
    reviceMessage(message) {
      console.log('收到消息', message)
    },
    getList(id, timestrap = null) {
      const _this = this
      RongIMLib.RongIMClient.getInstance().getHistoryMessages(1, _this.id, timestrap, this.meta.size, {
        onSuccess: function(list, hasMsg) {
          console.log('list', list)
          _this.chatList = list
        // list => Message 数组。
        // hasMsg => 是否还有历史消息可以获取。
        },
        onError: function(error) {
          console.log('GetHistoryMessages, errorcode:' + error)
        }
      })
      // message_detail(id || this.id).then(res => {
      //   console.log('res', res)
      //   if (res.code === 0) {
      //     this.list = res.data.reverse()
      //     this.$previewRefresh()
      //   }
      // })
    },
    concent() {
      RongIMLib.RongIMClient.connect(this.token, {
        onSuccess: function(userId) {
          console.log('连接成功, 用户 id 为', userId)
          // 连接已成功, 此时可通过 getConversationList 获取会话列表并展示
        },
        onTokenIncorrect: function() {
          console.log('连接失败, 失败原因: token 无效')
        },
        onError: function(errorCode) {
          var info = ''
          switch (errorCode) {
            case RongIMLib.ErrorCode.TIMEOUT:
              info = '链接超时'
              break
            case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
              info = '不可接受的协议版本'
              break
            case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
              info = 'appkey 不正确'
              break
            case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
              info = '服务器不可用'
              break
            default:
              info = errorCode
              break
          }
          console.log('连接失败, 失败原因: ', info)
        }
      })
    },
    async upload(e) {
      const res = await uploadImage(e.raw)
      console.log('upload', res)
      const postData = {
        type: 1,
        userId: this.id,
        message: res
      }
      this.handleSend(postData)
    },
    sendText() {
      const chat = this.chat.replace(/[\r\n]/g, '').replace(/(^\s*)|(\s*$)/g, '')
      if (!chat.length) {
        this.$message.error('请输入信息')
      } else {
        console.log('true')
        var msg = new RongIMLib.TextMessage({ content: chat, extra: '附加信息' })
        const postData = {
          type: 0,
          userId: this.id,
          message: chat
        }
        this.handleSend(msg)
      }
    },
    handleSend(msg, conversationType = 1) {
      const _this = this
      RongIMClient.getInstance().sendMessage(conversationType, this.id, msg, {
        onSuccess: function(message) {
        // message 为发送的消息对象并且包含服务器返回的消息唯一 Id 和发送消息时间戳
          console.log('Send successfully')
          _this.getList(this.id)
        },
        onError: function(errorCode, message) {
          var info = ''
          switch (errorCode) {
            case RongIMLib.ErrorCode.TIMEOUT:
              info = '超时'
              break
            case RongIMLib.ErrorCode.UNKNOWN:
              info = '未知错误'
              break
            case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
              info = '在黑名单中，无法向对方发送消息'
              break
            case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
              info = '不在讨论组中'
              break
            case RongIMLib.ErrorCode.NOT_IN_GROUP:
              info = '不在群组中'
              break
            case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
              info = '不在聊天室中'
              break
          }
          console.log('发送失败: ' + info + errorCode)
        }
      })
    },
    getGroupList() {
      chat_group_list().then(res => {
        console.log('chat_group_list', res)
        if (res.code === 0) {
          this.groupList = res.data.records
        }
      })
    },
    handleCreat() {
      const data = {
        name: this.newGroup.name,
        // customerServicePeopleIds: this.newGroup.id
        customerServicePeopleIds: [11, 12]
      }

      chat_group_create(data).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
        }
      })
    }

  }

}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
    display: flex;
    flex-direction: column;
  }
  .chat-container{
    margin-top: 40px;
      display: flex;
    min-height: 600px;
    flex-direction: column;
  }
    .chat-history{
    padding:20px;
    max-height: 700px;
    min-height: 400px;
    overflow-y:auto;
    background-color: #efefef;
    border-radius: 10px;
    flex:1;
  }

  .chat-item{
    margin: 10px;
    display: flex;
  }
  .chat-text{
    padding:10px 20px;
    margin: 0 10px;
    border-radius: 5px;
  }
  .avatar{
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    background: #c0c4cc;
    font-size: 14px;
    font-weight: bold;
    border-radius: 50%;
    overflow: hidden;
  }
  .reviced .chat-text{
      background-color: #f4f7f9;
      color:#263238;
    }

  .send .chat-text{
    background-color: #f4f7f9;
    color:#263238;
   }
.chat-item-warp{
  display: flex;
  width: 100%;
  height: auto;
}
  .reviced .chat-item-warp{
    justify-content: flex-start
  }
  .send .chat-item-warp{
    justify-content: flex-end
  }
  .chat-tip{
    margin: 20px 0;
    display: flex;
    justify-content: space-between
  }
  .chat-send{
    margin: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
  .massage-time{
    color:#aaa;
    font-size: 12px;
    margin:0 10px 4px;
  }
  .chatImage{
    max-width: 300px;
  }
</style>
