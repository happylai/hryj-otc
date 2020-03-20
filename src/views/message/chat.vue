<template>
  <div class="tab-container">
    <div class="chat-container">
      <div class="leftArea">
        <div class="his-list">
          <div class="tabs-box">
            <div class="tab-item " :class="conversationType===1?'active':'' " @click="handleClick(1)">进行中的会话</div>
            <div class="tab-item " :class="conversationType===3?'active':'' " @click="handleClick(3)">群聊会话</div>
          </div>
          <div v-show="conversationType===1">
            <div class="searchWarp">
              <el-input
                v-model="queryUuid"
                class="serchInput"
                style="border-radius:0;"
                placeholder="搜索uuid"
                clearable
                @change="handleQuery"
                @clear="handleQuery"
                @keyup.enter.native="handleQuery"
              />
            </div>

            <div v-for="(item,index) in queryUuid?queryList:list" :key="index+'user'" class="chat-userList" :class="item.targetId==id?'userListactive':'' " @click="changeCurrentChat(item.targetId,item)">
              <div class="chat-avatar">
                <el-badge :value="item.unreadMessageCount" class="item" :hidden="item.unreadMessageCount==0">
                  <el-avatar> user </el-avatar>
                </el-badge>
              </div>
              <div class="chat-his">
                <div class="chat-conact">
                  <div class="chat-user-name" :title="item.targetId">{{ item.remark?item.remark:item.targetId }}
                    <!-- <span>{{ item.remark }}</span> -->
                  </div>
                  <i class="el-icon-edit remarkUser" title="修改备注" @click="editReark(item)" />
                </div>
                <div style="text-align:right">{{ item.latestMessage.sentTime|timestampFormat }}</div>

                <div class="chat-des text-overflow">
                  <div v-if="item.latestMessage.messageType==='TextMessage'" class="text-overflow">{{ item.latestMessage.content.content }}</div>
                  <span v-else>[图片]</span>
                </div>
              </div>
            </div>
          </div>
          <div v-show="conversationType===3">
            <div v-for="(item,index) in groupList" :key="index+'user'" class="chat-userList" :class="item.uuid==id?'userListactive':'' " @click="changeCurrentChat(item.uuid)">
              <div class="chat-avatar">
                <el-badge :value="0" class="item" :hidden="true">
                  <el-avatar> {{ item.name }} </el-avatar>
                </el-badge>
              </div>
              <div class="chat-his">
                <div class="chat-conact">
                  <div class="chat-user-name">{{ item.name }}</div>
                  <div class="chat-user-time">{{ item.createTime }}</div>
                </div>
                <div class="chat-des text-overflow">
                  <!-- <div class="text-overflow" v-if="item.latestMessage.messageType==='TextMessage'">{{ item.latestMessage.content.content }}</div>
                  <span v-else>[图片]</span> -->
                </div>
              </div>
              <!-- <span v-if="item.latestMessage.messageType==='TextMessage'">{{ item.latestMessage.content.content }}</span>
              <span v-else>[图片]</span> -->
            </div>
          </div>
        </div>

      </div>
      <div class="rightArea">
        <div class="chat-header">
          <div class="chat-name">{{ currentObj.remark||currentObj.name||currentObj.uuid||id }}</div>
          <div>
            <el-dropdown v-if="conversationType===3" @command="handleDropdown">
              <span class="el-dropdown-link">
                管理<i class="el-icon-s-tools " />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">新建群聊</el-dropdown-item>
                <el-dropdown-item command="2">新增成员</el-dropdown-item>
                <el-dropdown-item command="3">移除成员</el-dropdown-item>
                <el-dropdown-item command="4">解散群组</el-dropdown-item>
                <el-dropdown-item command="5">添加群公告</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <div id="chatHistory" class="chat-history">
          <div class="loadMore">
            <el-button v-if="hasMsg&&chatList.length" type="text" :disabled="!hasMsg||historyLoading" :loading="historyLoading" @click="loadMoreHistory">点击加载更多</el-button>
            <span v-else>暂无更多记录</span>
          </div>
          <div v-for="(item,index) in chatList" :key="index" class="chat-item " :class="item.senderUserId==uuid?'send':'reviced' ">

            <div class="chat-item-warp">
              <div v-if="item.senderUserId!==uuid" class="chat-avatar ">
                <div class="avatar">{{ JSON.parse(item.content.extra).userName }}</div>
              </div>
              <div>
                <div class="massage-time">
                  <div>{{ JSON.parse(item.content.extra).userName }}
                    <span>{{ JSON.parse(item.content.extra).userId }}</span>
                  </div>
                  {{ item.sentTime|timestampFormat }}</div>
                <div class="chat-text">
                  <span v-if="item.messageType==='TextMessage'" class="textMessage">{{ item.content.content }}</span>

                  <img v-else v-lazy="item.content.imageUri" :preview="'chat'" class="chatImage">

                </div>

              </div>

              <div v-if="item.senderUserId==uuid" class="chat-avatar ">
                <div class="avatar">{{ JSON.parse(item.content.extra).userName }}</div>
              </div>
            </div>

          </div>
        </div>
        <div class="chat-tip">
          <div class="chat-tip-left">
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

          <div class="tip-text">按Enter键发送</div>
        </div>
        <div v-if="conversationType===3" class="atUserList">
          <div class="atTitle">
            @群成员
          </div>
          <el-select
            v-model="atGroupUserList"
            style="width:100%"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词搜索需要@的成员"
            :remote-method="queryUserBuyGroup"
            :loading="loading"
          >
            <el-option
              v-for="item in userQueryGroupList"
              :key="item.uuid"
              :label="item.remark||item.nick||item.uuid"
              :value="item.uuid"
            />
          </el-select>
        </div>
        <div class="chat-input">
          <!-- <textarea v-model="chat" class="chat-input-text" @keyup.enter.native="beforSend" /> -->
          <el-input
            v-model="chat"
            type="textarea"
            :rows="4"
            style="background-color:#f4f4f5;border:none"
            placeholder="请输入内容"
            @keyup.enter.native="beforSend"
          />
        </div>
        <div class="chat-send">
          <el-button size="small" @click="beforSend">发送</el-button>
        </div>
      </div>

    </div>
    <el-dialog
      title="新建群聊"
      :visible.sync="newGroupDig"
      width="400px"
    >
      <el-form ref="form" :model="newGroup" label-width="80px">
        <el-form-item label="群聊名称">
          <el-input v-model="newGroup.name" />
        </el-form-item>
        <el-form-item label="客服ID">
          <el-select v-model="newGroup.id" style="width:100%" multiple placeholder="请选择">
            <el-option
              v-for="item in customerlist"
              :key="item.uuid"
              :label="item.nickName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="actionLoading" :disabled="actionLoading" type="primary" @click="handleCreat">立即创建</el-button>
          <el-button @click="newGroupDig = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="添加群成员群聊"
      :visible.sync="joinGroup"
      width="400px"
    >
      <el-form ref="form" :model="newGroup" label-width="80px">
        <el-form-item label="成员id">
          <el-select
            v-model="joinGroupArr"
            style="width:100%"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词搜索成员"
            :remote-method="querUer"
            :loading="loading"
          >
            <el-option
              v-for="item in userQueryList"
              :key="item.uuid"
              :label="item.uuid"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="actionLoading" :disabled="actionLoading" type="primary" @click="handleJoin">立即加入</el-button>
          <el-button @click="joinGroup = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="移除群成员群聊"
      :visible.sync="delGroupNumDig"
      width="400px"
    >
      <el-form ref="form" :model="newGroup" label-width="80px">
        <el-form-item label="成员id">
          <el-select
            v-model="delGroupNumArr"
            style="width:100%"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词搜索成员"
            :remote-method="querUer"
            :loading="loading"
          >
            <el-option
              v-for="item in userQueryList"
              :key="item.uuid"
              :label="item.uuid"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="actionLoading" :disabled="actionLoading" type="primary" @click="handleDelGroupNum">立即移除</el-button>
          <el-button @click="delGroupNumDig = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="添加群公告"
      :visible.sync="addGroupNoticeDig"
      width="600px"
    >
      <el-form ref="form" :model="newGroup" label-width="120px">

        <el-form-item label="当前群公告">
          <div v-if="currentGroupNotice" v-html="currentGroupNotice.content" />
          <div v-else>暂无</div>
        </el-form-item>
        <el-form-item label="新的群公告">
          <el-input
            v-model="groupNotice"
            type="textarea"
            :rows="2"
            placeholder="请输入新群公告"
          />
        </el-form-item>
        <el-form-item>
          <el-button :loading="actionLoading" :disabled="actionLoading" type="primary" @click="handleDelNotice_save">立即添加</el-button>
          <el-button @click="addGroupNoticeDig = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="@群成员"
      :visible.sync="atDiag"
      width="400px"
    >
      <el-form ref="form" :model="newGroup" label-width="80px">
        <el-form-item label="成员id">
          <el-select
            v-model="atGroupUserList"
            style="width:100%"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词搜索成员"
            :remote-method="querUer"
            :loading="loading"
          >
            <el-option
              v-for="item in userQueryList"
              :key="item.uuid"
              :label="item.uuid"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="actionLoading" :disabled="actionLoading" type="primary" @click="handleJoin">立即加入</el-button>
          <el-button @click="joinGroup = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import tip from '@/components/Tip'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import { uploadImage } from '@/api/common'
import { message_detail, message_reply, chat_group_current, chat_group_create, chat_group_add_user,
  chat_group_users, customer_service_list, chat_group_remove_user, chat_group_delete, remark_set,
  chat_group_remarks, chat_group_users_groupid, notice_save, chat_group_notice } from '@/api/message'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, PayType, OrderStatus, CounterParty } from '@/utils/enumeration'
import { init } from '@/utils/rongcloudutils.js'
import _ from 'lodash'
import Vue from 'vue'
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
      id: undefined,
      token: '',
      appkey: '', // 这是我们之前保存的 appkey *重要
      targetId: '', // 你要给谁发送消息 目标ID
      showDatas: [], // 初始化信息
      groupList: [],
      newGroup: {
        id: undefined,
        name: undefined
      },
      dialogVisible: false,
      uuid: undefined,
      userName: undefined,
      tabIndex: '1',
      conversationType: 1,
      newGroupDig: false,
      delGroupNumDig: false,
      customerlist: [],
      joinGroup: false,
      joinGroupId: undefined,
      joinGroupArr: [],
      userQueryList: [],
      delGroupNumArr: [],
      groupChatList: [],
      atGroupUserList: [],
      userQueryGroupList: [],
      actionLoading: false,
      hasMsg: false,
      historyLoading: false,
      atDiag: false,
      currentObj: {},
      addGroupNoticeDig: false,
      groupNotice: undefined,
      currentGroupNotice: undefined,
      queryUuid: undefined,
      queryList: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
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
    setTimeout(() => {
      this.initRongCloud()
    }, 1000)
  },

  mounted() {
    this.token = this.userInfo.principal.rcloudToken
    this.uuid = this.userInfo.principal.rcloudUuid
    this.userName = this.userInfo.name
    if (this.token) {
      // this.getList()
      this.getGroupList()
    } else {
      this.$alert('请登录客服账号继续', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    }
  },
  methods: {
    handleClick2(tab, event) {
      console.log('handleClick', tab)
      const index = tab.index
      const arr = [1, 3]
      this.conversationType = arr[tab.index]
      const id = index === '1' ? (this.groupList && this.groupList.length ? this.groupList[0].uuid : undefined) : (this.list.length ? this.list[0].targetId : undefined)
      this.id = id
      if (index === '1') {
        this.getMessageList()
        console.log('index', index)
        this.currentObj = this.groupList[0]
      } else {
        this.currentObj = this.list[0]
      }
      console.log('targetId', id)
      if (id) {
        this.getList()
      }
    },
    handleClick(conversationType) {
      if (conversationType !== this.conversationType) {
        this.conversationType = conversationType
        const id = conversationType === 3 ? (this.groupList && this.groupList.length ? this.groupList[0].uuid : undefined) : (this.list.length ? this.list[0].targetId : undefined)
        this.id = id
        if (conversationType === 3) {
          this.getMessageList()
          this.currentObj = this.groupList[0]
        } else {
          this.currentObj = this.list[0]
        }
        console.log('targetId', id)
        if (id) {
          this.getList()
        }
      }
    },
    changeCurrentChat(id, current) {
      console.log('id', id)
      this.id = id.toString()
      this.currentObj = current
      this.atGroupUserList = []
      this.getList()
    },

    addPromptInfo(prompt, status) {
      console.log('连接状态', prompt, status)
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
      if (status === 0) {
        this.getMessageList()
      }
      // this.getMessageList()

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

    // 获取会后
    getChat(id, type = 1) {
      const _this = this
      RongIMClient.getInstance().getConversation(type, id || _this.id, {
        onSuccess: function(conversation) {
          if (conversation) {
            console.log('获取指定会话成功', conversation)
          }
        }
      })
    },

    // 获取ishi消息列表

    getMessageList() {
      const _this = this
      RongIMClient.getInstance().getConversationList({
        onSuccess: function(list) {
          console.log('list', list)

          if (list.length) {
            const userInfo = list[0].latestMessage.content.extra
            // console.log("userInfo",userInfo)
            // const userInfoObj = JSON.parse(userInfo)
            // console.log("userInfo",userInfoObj,userInfoObj.userName)
          } else {
            return false
          }
          if (_this.conversationType === 1) {
            _this.list = list
            _this.getRark(list)
          } else if (_this.conversationType === 3) {
            _this.groupChatLiat = list
          }

          if (list.length > 0 && _this.id === undefined) {
            const id = list[0].targetId.toString()
            console.log('id', id)
            _this.id = id
            _this.currentObj = list[0]
          }

          _this.getList()
        // list => 会话列表集合
        },
        onError: function(error) {
          console.log('error', error)
        // do something
        }
      }, [_this.conversationType])
    },

    initRongCloud() {
      const _this = this
      var appkey = process.env.VUE_APP_RCappkey
      var token = this.token
      if (!appkey || !token) {
        _this.$message.error('appkey 和 token 不能为空')
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
      this.getMessageList()
      this.getChat()
      // this.getList(new Date().getTime() - 1000 * 60 * 60 * 24)
    },
    getList(timestrap = 0,) {
      console.log('获取消息详情,对话', this.id, timestrap)
      const _this = this

      // this.delChat()
      this.historyLoading = true
      // 默认传 null, 若从头开始获取历史消息, 请赋值为 0
      var count = 20
      RongIMLib.RongIMClient.getInstance().getHistoryMessages(_this.conversationType, _this.id, timestrap, count, {
        onSuccess: function(list, hasMsg) {
          /*
            list: 获取的历史消息列表
            hasMsg: 是否还有历史消息可以获取
          */
          console.log('获取历史消息成功', list)
          _this.historyLoading = false
          _this.chatList = list
          _this.hasMsg = hasMsg

          var clearUnreadCount = RongIMClient.getInstance().clearUnreadCount
          clearUnreadCount(_this.conversationType, _this.id, {
            onSuccess: function() {},
            onError: function(errorCode) {}
          })
          setTimeout(() => {
            var ele = document.getElementById('chatHistory')
            ele.scrollTop = ele.scrollHeight
            _this.$previewRefresh()
          }, 100)
        },
        onError: function(error) {
          // 请排查：单群聊消息云存储是否开通
          _this.historyLoading = false
          _this.$message.error(error || '获取历史消息失败')
          console.log('获取历史消息失败', error)
        }
      })
    },

    getRark() {
      var a = []
      var list = this.list
      const b = list.map(item => { a.push(item.targetId) })
      console.log('list-----', list, a)

      chat_group_remarks({ uids: a.join(',') }).then(res => {
        console.log('res', res)
        const remarkList = res.data
        //eslint -disable-next-line
        const list = this.list

        if (remarkList.length) {
          remarkList.map(item => {
            list.map((listitem, index) => {
              // if (listitem.targetId === item.userId&&listitem.remark !== item.remark) { list[index].remark = item.remark }
              if (listitem.targetId === item.userId && listitem.remark !== item.remark) {
                list[index].remark = item.remark
                this.list.splice(index, 1, list[index])
              }
            })
          })
        }
        console.log('list', list)
        // const tiem = new Date().getTime()
        // Vue.set(this.list, tiem, list)
        this.list = list
        Vue.nextTick()
      })
    },

    async upload(e) {
      const res = await uploadImage(e.raw)
      console.log('upload', res)
      const extra = JSON.stringify({ userId: this.uuid, userName: this.userName ? this.userName : '游客' })
      var msg = new RongIMLib.ImageMessage({ content: '', imageUri: res, extra })
      this.handleSend(msg)
    },

    beforSend: _.throttle(function() {
      console.log('hello')
      this.sendText()
    }, 1000),
    sendText() {
      const chat = this.chat.replace(/[\r\n]/g, '').replace(/(^\s*)|(\s*$)/g, '')
      if (!chat.length) {
        this.$message.error('请输入信息')
      } else {
        // console.log('true')
        // const extra = JSON.stringify({ userId: this.uuid, userName: this.userName ? this.userName : '游客' })
        // var msg = new RongIMLib.TextMessage({ content: chat, extra })
        // this.handleSend(msg)
        this.handleSend(chat)
      }
    },
    handleSend(chat, conversationType = 1) {
      const _this = this
      var extra = JSON.stringify({ userId: this.uuid, userName: this.userName ? this.userName : '游客' })
      var isMentioned = false
      if (_this.conversationType === 3 && _this.atGroupUserList.length) {
        isMentioned = true
        var mentioneds = new RongIMLib.MentionedInfo() // @ 消息对象
        mentioneds.type = RongIMLib.MentionedType.PART
        mentioneds.userIdList = _this.atGroupUserList// @ 人员列表
        const atListStr = `@${_this.atGroupUserList.join(' @')}`
        chat = `${atListStr};${chat}`
        _this.atGroupUserList = []
        var msg = new RongIMLib.TextMessage({ content: chat, extra, mentionedInfo: mentioneds })
      } else {
        var msg = new RongIMLib.TextMessage({ content: chat, extra })
      }
      RongIMClient.getInstance().sendMessage(_this.conversationType, this.id.toString(), msg, {
        onSuccess: function(message) {
        // message 为发送的消息对象并且包含服务器返回的消息唯一 Id 和发送消息时间戳
          const time = new Date().getTime()
          console.log('Send successfully', time)
          _this.chat = undefined
          setTimeout(() => {
            _this.getList(0, 1)
          }, 500)
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
      }, isMentioned)
    },
    getGroupList() {
      chat_group_current().then(res => {
        console.log('chat_group_current', res)
        if (res.code === 0) {
          this.groupList = res.data
          if (!this.id && res.data && this.conversationType === 3) {
            this.id = res.data[0].uuid
            this.currentObj = res.data[0]
          }
        }
      })
    },
    handleCreat() {
      const data = {
        name: this.newGroup.name,
        // customerServicePeopleIds: this.newGroup.id
        customerServicePeopleIds: this.newGroup.id
      }

      chat_group_create(data).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.getGroupList()
        }
      })
    },

    // 删除会话
    delChat() {
      var params = {
        conversationType: this.conversationType,
        targetId: '"1226843160513089537"',
        timestamp: new Date().getTime() // 可取 sentTime, 收发消息和历史消息中都有 sentTime 字段
      }
      RongIMLib.RongIMClient.getInstance().clearRemoteHistoryMessages(params, {
        onSuccess: function() {
          console.log('清除成功')
        },
        onError: function(error) {
          console.log('清除失败', error)
        }
      })
    },
    getCustomerList() {
      customer_service_list({ current: 1, size: 100 }, { active: true }).then(res => {
        this.listLoading = false
        if (res.code === 0) {
          this.customerlist = res.data.records
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleNewGroup() {
      console.log('新建群聊')
      this.newGroupDig = true
      this.getCustomerList()
    },
    handleDropdown(command) {
      console.log('command', command)
      if (command === '1') {
        this.handleNewGroup()
      } else if (command === '2') {
        this.joinGroup = true
      } else if (command === '3') {
        this.delGroupNumDig = true
      } else if (command === '4') {
        this.delGroup()
      } else if (command === '5') {
        this.addGroupNoticeDig = true
        this.getQueryNotice()
      }
    },
    handleJoin() {
      const group = (this.groupList).filter(item => item.uuid == this.id)
      const data = {
        groupId: group[0].id,
        userIds: this.joinGroupArr
      }
      this.actionLoading = true
      chat_group_add_user(data).then(res => {
        this.actionLoading = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '加入成功'
          })
          this.joinGroup = false
          this.getGroupList()
        }
      }).catch(() => {
        this.actionLoading = false
      })
    },
    handleDelGroupNum() {
      const group = (this.groupList).filter(item => item.uuid == this.id)
      const data = {
        groupId: group[0].id,
        userIds: this.delGroupNumArr
      }
      this.actionLoading = true
      chat_group_remove_user(data).then(res => {
        this.actionLoading = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '移除成功'
          })
          this.delGroupNumDig = false
          this.getGroupList()
        } else {

        }
      }).catch(() => {
        this.actionLoading = false
      })
    },

    querUer(data) {
      chat_group_users({ current: 1, size: 10 }, { query: data }).then(res => {
        if (res.code === 0) {
          this.userQueryList = res.data.records
        }
      })
    },
    queryUserBuyGroup(data) {
      const postData = {
        query: data,
        id: this.id
      }
      console.log('postData', postData)
      chat_group_users_groupid(postData).then(res => {
        if (res.code === 0) {
          this.userQueryGroupList = res.data.records
        }
      })
    },
    delGroup() {
      this.$confirm('是否解散当前群组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const group = (this.groupList).filter(item => item.uuid == this.id)

        const data = {
          groupIds: [group[0].id]
        }
        this.actionLoading = true
        chat_group_delete(data).then(res => {
          this.actionLoading = false
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '解散群组成功!'
            })
            this.id = undefined
            this.getGroupList()
          }
        }).catch(() => {
          this.actionLoading = false
        })
      })
    },
    editReark(item) {
      const name = item.remark ? item.remark : item.targetId
      console.log('item', item, item.remark, item.targetId)
      this.$prompt(`修改${name}的备注`, '修改备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (value) {
          remark_set({ userId: item.targetId, remark: value }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '备注修改成功'
              })
              this.getRark()
            }
          })
        }
      }).catch(() => {

      })
    },
    getQueryNotice() {
      chat_group_notice(this.currentObj.id).then(res => {
        if (res.code === 0) {
          this.currentGroupNotice = res.data
        }
      })
    },
    handleQuery() {
      const query = this.queryUuid
      const data = this.list
      console.log('query', query, data)

      var len = data.length
      var arr = []
      for (var i = 0; i < len; i++) {
        // 如果字符串中不包含目标字符会返回-1
        if (data[i].targetId.indexOf(query) >= 0) {
          arr.push(data[i])
        }
      }
      // this.list = arr;
      this.queryList = arr
    },
    handleDelNotice_save(data) {
      if (!this.groupNotice) {
        this.$message.error('请输入群公告')
      }
      const postData = {
        content: this.groupNotice,
        groupId: this.currentObj.id
      }
      this.actionLoading = true

      notice_save(postData).then(res => {
        this.actionLoading = false

        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '公告添加成功'
          })
          this.addGroupNoticeDig = false
          this.groupNotice = undefined
        }
      }).catch(() => {
        this.actionLoading = false
      })
    },
    loadMoreHistory() {
      const _this = this

      // this.delChat()
      this.historyLoading = true
      // 默认传 null, 若从头开始获取历史消息, 请赋值为 0
      var count = 20
      const timestrap = this.chatList[0].sentTime
      RongIMLib.RongIMClient.getInstance().getHistoryMessages(_this.conversationType, _this.id, timestrap, count, {
        onSuccess: function(list, hasMsg) {
          /*
            list: 获取的历史消息列表
            hasMsg: 是否还有历史消息可以获取
          */
          console.log('获取历史消息成功', list, hasMsg)
          var temp = _this.chatList
          temp.unshift(...list)
          // const data = { ...list, ..._this.chatList }
          console.log('data', temp)
          _this.historyLoading = false
          _this.chatList = temp
          _this.hasMsg = hasMsg

          var clearUnreadCount = RongIMClient.getInstance().clearUnreadCount
          clearUnreadCount(_this.conversationType, _this.id, {
            onSuccess: function() {},
            onError: function(errorCode) {}
          })
          setTimeout(() => {
            _this.$previewRefresh()
          }, 100)
        },
        onError: function(error) {
          // 请排查：单群聊消息云存储是否开通
          _this.historyLoading = false
          _this.$message.error(error || '获取历史消息失败')
          console.log('获取历史消息失败', error)
        }
      })
    }

  }

}
</script>

<style scoped lang="scss">
  .tab-container {
    margin: 30px;
    display: flex;
    flex-direction: column;
  }
  .chat-container{
      display: flex;
    min-height: 750px;
    width: 1160px;
    border-radius:10px;
    flex-direction: row;
    overflow: hidden;
  }
  .tabs-box{
    height: 17px;
    margin-top: 20px;
    margin-bottom: 13px;
    display: flex;
  }
  .tab-item{
    display: flex;
    flex:1;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .tab-item.active{
    color: #FFFFFF;
  }
  .tab-item:first-child{
    border-right: 1px solid #5C5E63;
  }
  .chat-container .leftArea{
    flex:2;
  }
  .his-list{
    height: 750px;

  }
  .chat-container .rightArea{
    flex:5;
    background-color: #f3f3f5
  }
    .chat-history{
    padding:20px;
    height: 500px;
    overflow-y:auto;
    background-color: #EFEEF1;
    border-radius: 10px;
    flex:1;
  }

  .chat-item{
    margin: 10px;
    margin-bottom: 20px;
    display: flex;
  }
  .chat-text{
    padding:10px 20px;
    margin: 0 10px;
    border-radius: 5px;
    max-width: 500px;
    .textMessage{
      max-width: 500px;
      word-wrap:break-word ;
    }
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
  .chat-user-time{
    font-size: 10px;
    color: #515555
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
   border-top:  1px solid #DCDFE6;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between
  }
  .atUserList{
    padding: 0 20px 10px;
    display: flex;
    align-items: center;
    .atTitle{
      width: 100px;
    }
  }
  .chat-send{
    margin-right: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
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
  .el-tabs--border-card>.el-tabs__content {
    padding: 0 !important
}
  .chat-userList{
    height: 86px;
    display: flex;
    align-items: center;
    padding:0 20px;
  }
 .userListactive{
    background: #292B2E;
  }
  .chat-conact{
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  .chat-his{
    margin-left:8px;
    flex:1;
    font-size:10px;
    width: 80%;

  }
  .chat-user-name{
    font-size:14px;
    color:#fff;
  }
  .chat-des{
    font-size: 14px;
    max-width: 210px;

  }
  .text-overflow{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chat-avatar{
    width: 40px;
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item {
    -webkit-transition: all .3s cubic-bezier(.645,.045,.355,1);
    transition: all .3s cubic-bezier(.645,.045,.355,1);
    border: 1px solid transparent;
    margin-top: -1px;
    color: #9FA1A6;
    width: 50% !important;
}
.el-tabs__nav {
  width: 100% !important;
}
.leftArea{
  background-color: #36343C;
  color:#999999;
}
.chat-header{
  height: 50px;
  padding:0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F3F3F5;
  border-bottom:  1px solid #DCDFE6;
}
.tip-text{
  color:#A3A7AE
}
.chat-input-text{
      border:none !important;
    background-color: #F3F3F5 !important;
    width: 100%;
    height: 100px;
    padding:0 20px;
    &:focus{
      border:none
    }
}
.chat-input-text:focus{
  border:none
}
.chat-input{
  padding:0 20px 10px;

}
  .el-textarea__inner{
    border:none !important;
    background-color: #F3F3F5 !important;
  }
textarea{
    border:none !important;

    background-color: #F3F3F5 !important;

}
.loadMore{
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #aaa;
  margin-top:-10px;
}
.chat-tip-left{
  display:flex;
}
.remarkUser{
  cursor:pointer
}
.searchWarp{
  .el-input__inner{
    border-radius: 0;
    background-color: rgba(100,100,100,.8)
  }
}
.searchWarp >>> .el-input__inner{
    border-radius: 0;
    border:none;
    color:#fff;
    background-color: rgba(100,100,100,.8)
  }

</style>
