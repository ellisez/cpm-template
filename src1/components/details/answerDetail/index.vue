<template>
  <div class="info">
    <div class="name" v-if="info.isUser == '1'">本人</div>
    <div class="title">

      <div class="status"
      v-if="info.isUser == '1'"
      :class="{'auditing':info.auditStatus == 'A',
                'faild':info.auditStatus == 'C'}"
      >{{ info.auditStatus == 'A'?'审核中':info.auditStatus == 'B'?'已通过':'未通过' }}</div>
      {{ info.question }}
    </div>
    <!-- 提问审核通过并且没有回答过 -->
    <div class="to-answer" @click="toAnswer" v-show="info.auditStatus == 'B' && info.isAnswer != 1">我要回答>></div>
    <!-- 提问审核通过并且回答过 -->
    <div class="to-answer answered" @click="toMyAnswer" v-show="info.auditStatus == 'B' && info.isAnswer == 1">我已回答</div>

    <div class="gray10"></div>

    <div class="lists">
      <answer v-for="(item,index) in info.academicAnswer" :key="index" :value='item' :voiceUrl='voiceUrl' :player='player' @setUrl='setUrl'/>
    </div>
    <div class="share" v-show="showShare" @click="share">
      <img src="src1/assets/images/share.png" alt="">
    </div>

    <Popup
      v-model="popupVisible"
      style="height:25%;width:100%;background:rgba(0,0,0,0)"
      position="bottom"
    >
      <div class="wrapBox">
        <div class="shareBox">
          <div @click="select('4')" class="area">
            <img src="src1/assets/imagesD/area.png">
            <span>专区</span>
          </div>
        </div>
        <div class="close">
          <img @click="close" src="src1/assets/imagesD/close.png">
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import storage from 'storejs'
import { Toast, Dialog, Popup } from 'vant'
import answer from '../../lists/answer'
import { changeTitle } from '../../../utils/func'
import share from '../../../utils/share'
export default {
  components: {
    answer, Popup
  },
  computed: {
    showShare () {
      return !!storage.get('userInfoAMY')
    }
  },
  created () {
    this.player = new Audio()
    this.player.addEventListener('play', () => {
      console.log('录音播放', this.player)
      if (this.report_listen_timer) {
        clearInterval(this.report_listen_timer)
      }
      // 设置定时器上报时长
      this.report_listen_timer = setInterval(() => {
        let data = {
          type: this.voiceUrl.type,
          code: this.voiceUrl.code,
          logType: '2',
          viewId: ''
        }
        this.reportUserTime(data).then(res => {
          console.log(res)
        })
      }, 5000)
      // this.playing = false
    })
    this.player.addEventListener('pause', () => {
      console.log('录音暂停', this.player)
      clearInterval(this.report_listen_timer)
      // this.playing = false
    })
    this.player.addEventListener('timeupdate', () => {
      // console.log('录音播放中',this.player.src)
      // this.playing = false
    })
    this.player.addEventListener('ended', () => {
      console.log('录音播放结束', this.player.src)
      this.voiceUrl = {}
      // this.playing = false
    })
    this.getInfo()

    this.baoSaveReport({
      PageName: '问题详情页',
      EventID: '1',
      ControlName: '',
      Description: location.href
    })
  },
  mounted () {
    window.pageYOffset = 0
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    this.hideLoad()
  },
  data () {
    return {
      info: {},
      player: '',
      voiceUrl: {},
      report_listen_timer: '',
      popupVisible: false
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getQuestionDetail: 'content/getQuestionDetail',
      reportUserTime: 'content/reportUserTime',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    select (channel) {
      try {
        this.baoSaveReport({
          PageName: '问题详情',
          EventID: '2',
          ControlName: '代表推送',
          Description: location.href
        })
      } catch (error) {
        console.log(error)
      }
      // this.item.code = this.$route.query.code;
      // this.item.fieldName = this.$route.query.fieldName;
      // this.item.shareEncryptKey = this.$route.query.shareEncryptKey;
      // this.item.title = this.$route.query.title;
      // this.item.type = this.$route.query.type;
      // this.item.channel = this.$route.query.channel;
      this.$router.push({
        path: '/sendDBT',
        query: {
          code: this.info.code,
          shareEncryptKey: this.info.shareEncryptKey,
          title: this.info.question,
          type: this.info.type,
          channel,
          columnName: this.info.modelName || ''
        }
      })
    },

    close () {
      this.popupVisible = false
    },
    share () {
      console.log('分享点击')
      this.popupVisible = true
    },

    toMyAnswer () {
      this.$router.push({ name: 'answer', query: { code: this.$route.query.code } })
    },

    toAnswer () {
      try {
        this.baoSaveReport({
          PageName: '问题详情页',
          EventID: '2',
          ControlName: '我要回答-按钮',
          Description: '点击我要回答' + location.href
        })
      } catch (error) {
        console.log(error)
      }
      if (!storage.get(process.env.VUE_APP_STORAGE_NAME) || (storage.get(process.env.VUE_APP_STORAGE_NAME) && !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt)) {
        Dialog.confirm({
          title: '提示',
          message: '未登录无法进行此操作！',
          confirmButtonText: '去登录',
          cancelButtonText: '再看看',
          showCancelButton: true
        }).then(() => {
          // on confirm
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {
          // on cancel
        })
        return
      }
      console.log('去回答问题')
      let encrypt = storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
      if (!encrypt) {
        this.$router.push({
          path: '/login'
        })
        return
      }
      if (!(/MicroMessenger/i.test(navigator.userAgent))) { // 判断当前是否微信环境
        Toast('当前语音回答只支持微信环境，请更换微信登录尝试回答问题！给您造成不便，敬请谅解！')
        return
      }

      if (storage.get(process.env.VUE_APP_STORAGE_NAME).realnameAuthStatus == 'C' || storage.get(process.env.VUE_APP_STORAGE_NAME).realnameAuthStatus == 'B' || storage.get('userInfoAMY')) {
        this.baoSaveReport({
          PageName: '问题详情页',
          EventID: '2',
          ControlName: '我要回答-按钮',
          Description: '进入回答页面' + location.href
        })
        // 认证状态在认证中和已认证用户可以答题
        const { code } = this.$route.query
        this.$router.push({ name: 'answer', query: { code } })
      } else if (storage.get(process.env.VUE_APP_STORAGE_NAME).realnameAuthStatus == 'D') {
        // 认证未通过提示
        console.log('认证未通过')
        Dialog.confirm({
          title: '',
          message: '您的认证信息，未通过审核，请您再次提交认证信息！',
          confirmButtonText: '去认证',
          cancelButtonText: '再看看'
        }).then(() => {
          // on confirm
          this.$router.push({
            path: '/upauthimg'
          })
        }).catch(() => {
          // on cancel
        })
      } else {
        // 未认证提示
        console.log('未认证')
        Dialog.confirm({
          title: '',
          message: '<p>请完善信息升级为认证用户,即可回答问题</p><p>并获得<span style="color:#d93639;">30积分</span>奖励,可用来兑换</p><p>精美礼品哦</p>',
          confirmButtonText: '去认证',
          cancelButtonText: '再看看'
        }).then(() => {
          // on confirm
          this.$router.push({
            path: '/upauthimg'
          })
        }).catch(() => {
          // on cancel
        })
      }
    },
    // 答案子组件返回的当前播放器播放的录音信息
    setUrl (url) {
      this.voiceUrl = url
    },
    async getInfo () {
      try {
        var res = await this.getQuestionDetail(this.$route.query)
        this.info = res.data

        share({
          title: this.info.question,
          desc: this.info.summary || '',
          link: `${location.origin}${location.pathname}#/answerDetail?shareEncryptKey=${this.info.shareEncryptKey}&id=${this.info.id}&code=${this.info.code}&source=16`,
          imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg',
          shareEncryptKey: this.info.shareEncryptKey,
          type: this.info.type
        })
        changeTitle('更多解答')
        console.log(this.info)
      } catch (error) {
        console.log(error)
      }
    }
  },
  beforeDestroy () {
    this.player.pause()
  },
  watch: {
    $route () {
      this.player.pause()
      this.voiceUrl = ''
    }
  }
}
</script>

<style lang='less' scoped>
@import url('src1/stylewerDetail.less');
.share {
  width: 0.62rem;
  position: fixed;
  right: 10px;
  bottom: 30%;
}
.wrapBox {
  height: 95%;
  margin: 0 auto;
  width: 95%;
  background: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}
.shareBox {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 0.18rem;
  div {
    img {
      display: block;
      width: 0.4rem;
      height: 0.4rem;
    }
    span {
      display: block;
      width: 100%;
      text-align: center;
      line-height: 0.4rem;
      font-size: 0.12rem;
      color: #4a4a4a;
    }
  }
}
.close {
  width: 100%;
  margin-top: 0.1rem;
  padding-bottom: 0.1rem;
  img {
    display: block;
    margin: 0 auto;
    width: 0.4rem;
    height: 0.4rem;
  }
}
</style>
