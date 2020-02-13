<template>
  <div class="tab-container">
    <div class="chat-container">
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
            <el-tabs v-model="tabIndex" type="border-card" @tab-click="handleClick">
              <el-tab-pane label="进行中的会话" name='1'>
                <div  v-for="(item,index) in list" :key="index+'user'" @click="changeCurrentChat(item.targetId)" class="chat-userList" :class="item.targetId==id?'userListactive':'' ">
                  <div class="chat-avatar">
                    <el-badge :value="item.unreadMessageCount" class="item" :hidden="item.unreadMessageCount==0">
                     <el-avatar> user </el-avatar>
                    </el-badge>
                  </div>
                  <div class="chat-his">
                    <div class="chat-conact">
                      <div class="chat-user-name">{{item.targetId}}</div>
                      <div>{{item.latestMessage.sentTime|timestampFormat}}</div>
                    </div>
                    <div class="chat-des text-overflow">
                      <div class="text-overflow" v-if="item.latestMessage.messageType==='TextMessage'">{{ item.latestMessage.content.content }}</div>
                      <span v-else>[图片]</span>
                    </div>
                  </div>

                </div>
              </el-tab-pane>
              <el-tab-pane label="群聊会话" name="3">
                <div v-for="(item,index) in groupList" :key="index+'user'" @click="changeCurrentChat(item.uuid)" class="chat-userList" :class="item.targetId==id?'userListactive':'' ">
                  <!-- <el-avatar> {{ item.name }} </el-avatar>
                  <span>{{ item.name }}</span>
                  <span>{{ item.createTime }}</span> -->

                  <div class="chat-avatar">
                    <el-badge :value="0" class="item" :hidden="false">
                     <el-avatar> {{item.name}} </el-avatar>
                    </el-badge>
                  </div>
                  <div class="chat-his">
                    <div class="chat-conact">
                      <div class="chat-user-name">{{item.name}}</div>
                      <div>{{item.createTime}}</div>
                    </div>
                    <div class="chat-des text-overflow">
                      <!-- <div class="text-overflow" v-if="item.latestMessage.messageType==='TextMessage'">{{ item.latestMessage.content.content }}</div>
                      <span v-else>[图片]</span> -->
                    </div>
                  </div>
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
          <div class="chat-history" id="chatHistory">
            <div v-for="(item,index) in chatList" :key="index" class="chat-item " :class="item.senderUserId==id?'reviced':'send' ">

              <div class="chat-item-warp">
                <div v-if="!item.senderUserId==id" class="chat-avatar ">
                  <div class="avatar">{{ (item.targetId) }}</div>
                </div>
                <div>
                  <div class="massage-time">
                    <div>{{JSON.parse(item.content.extra).userName}}</div>
                    {{ item.sentTime|timestampFormat }}</div>
                  <div class="chat-text">
                    <span v-if="item.messageType==='TextMessage'">{{ item.content.content }}</span>

                    <img v-else v-lazy="item.content.imageUri" :preview="'chat'" class="chatImage">

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
      id: "1226843160513089537",
      token: '',
      appkey: 'p5tvi9dspqhm4', // 这是我们之前保存的 appkey *重要
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
      conversationType:1
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
    setTimeout(()=>{
    this.initRongCloud()
    },1000)

  },

  mounted() {
    this.token = this.userInfo.principal.rcloudToken
    this.uuid= this.userInfo.principal.rcloudUuid
    this.userName=this.userInfo.name
    if( this.token ){
      // this.getList()
      this.getGroupList()
    }else{
        this.$alert('请登录客服账号继续', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${ action }`
          });
        }
      });
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab)
      const index=tab.index;
      const arr = [1, 3]
      this.conversationType = arr[tab.index]
      const id=index==="1"?(this.groupList.length?this.groupList[0].uuid:undefined):(this.chatList.length ? this.chatList[0].targetId : undefined)
      this.id=id
      console.log("targetId",id)
      this.getList()
    },
    changeCurrentChat(id) {
      console.log('id', id)
      this.id = id.toString()
      this.getList()
    },

    addPromptInfo(prompt,status) {
      console.log("连接状态", prompt, status)
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
      if( status===0 )  {
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

    //获取会后
    getChat(id,type=1){
      const _this=this;
      RongIMClient.getInstance().getConversation(type, id||_this.id, {
        onSuccess: function(conversation) {
          if (conversation) {
            console.log('获取指定会话成功', conversation);
          }
        }
      });
    },

    // 获取ishi消息列表

    getMessageList() {
      const _this = this
      RongIMClient.getInstance().getConversationList({
        onSuccess: function(list) {
          console.log('list', list)

          if(list.length) {
            const userInfo = list[0].latestMessage.content.extra;
            // console.log("userInfo",userInfo)
            // const userInfoObj = JSON.parse(userInfo)
            // console.log("userInfo",userInfoObj,userInfoObj.userName)
          }else{
            return false
          }

          _this.list = list
          if (list.length > 0 && !this.id) {
            const id=list[0].targetId.toString();
            console.log("id",id)
            _this.id = id
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
      this.getMessageList()
      this.getChat()
      this.getList(new Date().getTime()-1000*60*60*24)

    },
    getList( timestrap = 0,) {
      console.log("获取消息详情,对话",this.id,timestrap)
      const _this = this

      this.delChat()
      // 默认传 null, 若从头开始获取历史消息, 请赋值为 0
      var count = 20;
      RongIMLib.RongIMClient.getInstance().getHistoryMessages(_this.conversationType, _this.id, timestrap, count, {
        onSuccess: function(list, hasMsg) {
          /* 
              list: 获取的历史消息列表
              hasMsg: 是否还有历史消息可以获取
            */
          console.log('获取历史消息成功', list);
          _this.chatList = list

          var clearUnreadCount = RongIMClient.getInstance().clearUnreadCount;
          clearUnreadCount(_this.conversationType, _this.id, {
              onSuccess: function () {},
              onError: function (errorCode) {}
          });
          setTimeout(()=>{
            var ele = document.getElementById('chatHistory');
            ele.scrollTop = ele.scrollHeight;
            _this.$previewRefresh()
          },100)
                      
        },
        onError: function(error) {
          // 请排查：单群聊消息云存储是否开通
          console.log('获取历史消息失败', error);
        }
      });



    },

    async upload(e) {
      const res = await uploadImage(e.raw)
      console.log('upload', res)
      let extra = JSON.stringify({ userId: this.uuid, userName: this.userName ? this.userName : '游客' })
      var msg = new RongIMLib.ImageMessage({content: '', imageUri: res, extra});
      this.handleSend(msg)
    },
    sendText() {
      const chat = this.chat.replace(/[\r\n]/g, '').replace(/(^\s*)|(\s*$)/g, '')
      if (!chat.length) {
        this.$message.error('请输入信息')
      } else {
        console.log('true')
        let extra = JSON.stringify({ userId: this.uuid, userName: this.userName ? this.userName : '游客' })
        var msg = new RongIMLib.TextMessage({ content: chat, extra })
        this.handleSend(msg)
      }
    },
    handleSend(msg, conversationType = 1) {
      const _this = this
      RongIMClient.getInstance().sendMessage(_this.conversationType, this.id.toString(), msg, {
        onSuccess: function(message) {
        // message 为发送的消息对象并且包含服务器返回的消息唯一 Id 和发送消息时间戳
          const time= new Date().getTime()
          console.log('Send successfully',time)
          _this.getList(0,1)
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
    },

    // 删除会话
    delChat(){
    var params = {
      conversationType:this.conversationType,
      targetId: '"1226843160513089537"',
      timestamp: new Date().getTime() // 可取 sentTime, 收发消息和历史消息中都有 sentTime 字段
    };
    RongIMLib.RongIMClient.getInstance().clearRemoteHistoryMessages(params, {
      onSuccess: function() {
        console.log('清除成功');
      },
      onError: function(error) {
        console.log('清除失败', error);
      }
    });
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
  .chat-userList{
    display: flex;
    align-items: center;
    margin:4px 0;
  }
 .userListactive{
    background: #efefef;
  }
  .chat-conact{
    display: flex;
    justify-content: space-between;
  }
  .chat-his{
    margin-left:8px;
    flex:1;
    font-size:10px;
    width: 80%;

  }
  .chat-user-name{
    font-size:14px;
  }
  .chat-des{
    font-size: 12px;
    width: 100%;

  }
  .text-overflow{
    overflow: hidden; 
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chat-avatar{
    width: 40px;
  }
</style>
