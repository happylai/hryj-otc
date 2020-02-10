<template>
  <div class="init">
    <van-nav-bar title="连接融云" />
    <van-cell-group>
      <van-field v-model="appkey"
                 required
                 label="appkey"
                 placeholder="请输入您的 appkey" />
      <van-field v-model="token"
                 label="token"
                 placeholder="请输入您的 token"
                 required />
      <van-field v-model="targetId"
                 label="targetId"
                 placeholder="请输入 targetId"
                 required />
    </van-cell-group>
    <van-button class="init-button"
                type="info"
                @click="initRongCloud">初始化连接</van-button>
    <div class="rong-show-box">
      <p v-for="data in showDatas"
         v-bind:key="data">
        {{data}}
      </p>
    </div>
  </div>
</template>

<script>
import { init } from '../../utils'

export default {
  data () {
    return {
      appkey: '',    // 这是我们之前保存的 appkey *重要
      token: '',     // token 可以多次生成 之前也有介绍过
      targetId: '',  // 你要给谁发送消息 目标ID
      showDatas: [], // 初始化信息
    }
  },
  methods: {
    addPromptInfo (prompt, userId = null) {
      const _this = this

      const avatarList = [
        'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4100987808,2324741924&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2988245209,2476612762&fm=26&gp=0.jpg',
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=4259300811,497831842&fm=26&gp=0.jpg',
        'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3684587473,1286660191&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2884107401,3797902000&fm=26&gp=0.jpg'
      ]
      
      // 真实环境是通过登录 后台接口返回的 token 拿到的用户信息  我在这为为了模拟 所以给初始化后的用户随机生成一个头像
      const avatar = avatarList[Math.floor(Math.random() * (3 + 1))] 
      _this.showDatas.push(prompt)
      const timer = setInterval(() => {
        if (userId) {
          clearInterval(timer) // 路由跳转后销毁定时器
          _this.$store.commit('SET_MEMBER', {   // 保存用户信息
            userId: userId,
            avatar: avatar
          })
          _this.$store.commit('SET_TARGETID', _this.targetId)  // 保存目标ID
          _this.$router.push({ name: 'RongCloud' })
        }
      }, 500)
    },
    initRongCloud () {
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
    }
  }
}
</script>


