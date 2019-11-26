<template>
  <div class="tab-container">
    <div>与{{ this.id }}对话中</div>
    <div class="chat-container">
      <div class="chat-history">
        <div v-for="(item,index) in list" :key="index" class="chat-item " :class="item.fromAdmin?'send':'reviced' ">
          <div class="chat-item-warp">
            <div v-if="!item.fromAdmin" class="chat-avatar ">
              <div class="avatar">{{ (item.nickName) }}</div>
            </div>
            <div>
              <div class="massage-time">{{ item.createTime|timesArrayFormat }}</div>
              <div class="chat-text">
                <span v-if="item.type===0">{{ item.message }}</span>
                <img v-else v-lazy="item.message" class="chatImage">
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
    </div>
  </div>
</template>

<script>
import tip from '@/components/Tip'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import { uploadImage } from '@/api/common'
import { message_detail, message_reply } from '@/api/message'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, PayType, OrderStatus, CounterParty } from '@/utils/enumeration'
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
      chat: undefined
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
    this.getList(id)
  },
  methods: {

    getList(id) {
      message_detail(id || this.id).then(res => {
        console.log('res', res)
        if (res.code === 0) {
          this.list = res.data.reverse()
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
        const postData = {
          type: 0,
          userId: this.id,
          message: chat
        }
        this.handleSend(postData)
      }
    },
    handleSend(data) {
      message_reply(data).then(res => {
        console.log('res', res)
        if (res.code === 0) {
          this.chat = undefined
          this.getList()
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
