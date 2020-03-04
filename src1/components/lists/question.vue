<template>
  <div class="question" @click.stop="toDetail">
    <div class="top" v-show="value.isTop == 'Y'">
      <img src="src1/assets/images/top.png" alt>
    </div>
    <div class="title" :class="{'hide':!value.academicAnswer[0]}">
      <span style="color:#00CC66;" v-show="value.isUser == 1">【我】</span>
      <span v-show="value.isAnswer == 1" style="color:#00CC66;">【已答】</span>
      {{ value.question }}
    </div>
    <div class="nums">
      <div class="date">{{ value.createTime.slice(5,10) }}</div>
      <div class="read">{{ readNum |numsFormat }}</div>
      <div class="praise" v-show="praiseNum > 0">{{ praiseNum |numsFormat }}</div>

      <div class="answer-btn" @click.stop="toAnswer(value)">答</div>
    </div>

    <div class="answer-info" v-if="value.academicAnswer[0]">
      <div
        class="listen"
        :class="{'playing':voiceUrl.answerUrl == value.academicAnswer[0].answerUrl && playing}"
        @click.stop="play"
      >听专家怎么说</div>
      <div class="time">00:{{ value.academicAnswer[0].voiceDuration }}</div>
      <!-- <div class="praise">{{ value.academicAnswer[0].praiseNum }}</div> -->
      <!-- <div class="listen-num">{{ value.academicAnswer[0].readNum }}人听过</div> -->
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Toast, Dialog } from 'vant'
import storage from 'storejs'
export default {
  props: {
    value: {
      type: Object
    },
    player: {
      type: HTMLAudioElement
    },
    voiceUrl: {
      type: Object
    },
    source: { type: [Number, String] }
  },
  filters: {
    // 点赞数，阅读数优化
    numsFormat (num) {
      if (num < 10000) {
        return num
      } else {
        var n = parseInt(num / 10000)
        var other = num % 10000
        other = parseInt(other / 1000)
        if (other > 0) {
          return n + '.' + other + '万'
        } else {
          return n
        }
      }
    }
  },
  created () {
    this.readNum = +this.value.readNum
    this.praiseNum = +this.value.praiseNum
    this.value.academicAnswer.forEach(ele => {
      this.readNum += ele.readNum
      this.praiseNum += ele.praiseNum
    })
  },
  data () {
    return {
      readNum: '',
      praiseNum: '',
      playing: false,
      canReport: true
    }
  },
  methods: {
    ...mapActions({
      reportReadNum: 'content/reportReadNum',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    toAnswer2 () {
      console.log('去回答问题')
    },

    toAnswer (item) {
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
      if (
        !storage.get(process.env.VUE_APP_STORAGE_NAME) ||
        (storage.get(process.env.VUE_APP_STORAGE_NAME) &&
          !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt)
      ) {
        Dialog.confirm({
          title: '提示',
          message: '未登录无法进行此操作！',
          confirmButtonText: '去登录',
          cancelButtonText: '再看看',
          showCancelButton: true
        })
          .then(() => {
            // on confirm
            this.$router.push({
              path: '/login'
            })
          })
          .catch(() => {
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
      if (!/MicroMessenger/i.test(navigator.userAgent)) {
        // 判断当前是否微信环境
        Toast(
          '当前语音回答只支持微信环境，请更换微信登录尝试回答问题！给您造成不便，敬请谅解！'
        )
        return
      }

      if (
        storage.get(process.env.VUE_APP_STORAGE_NAME).realnameAuthStatus == 'C' ||
        storage.get(process.env.VUE_APP_STORAGE_NAME).realnameAuthStatus == 'B' ||
        storage.get('userInfoAMY')
      ) {
        this.baoSaveReport({
          PageName: '问题详情页',
          EventID: '2',
          ControlName: '我要回答-按钮',
          Description: '进入回答页面' + location.href
        })
        // 认证状态在认证中和已认证用户可以答题
        const { code } = item
        this.$router.push({ name: 'answer', query: { code } })
      } else if (
        storage.get(process.env.VUE_APP_STORAGE_NAME).realnameAuthStatus == 'D'
      ) {
        // 认证未通过提示
        console.log('认证未通过')
        Dialog.confirm({
          title: '',
          message: '您的认证信息，未通过审核，请您再次提交认证信息！',
          confirmButtonText: '去认证',
          cancelButtonText: '再看看'
        })
          .then(() => {
            // on confirm
            this.$router.push({
              path: '/upauthimg'
            })
          })
          .catch(() => {
            // on cancel
          })
      } else {
        // 未认证提示
        console.log('未认证')
        Dialog.confirm({
          title: '',
          message:
            '<p>请完善信息升级为认证用户,即可回答问题</p><p>并获得<span style="color:#d93639;">30积分</span>奖励,可用来兑换</p><p>精美礼品哦</p>',
          confirmButtonText: '去认证',
          cancelButtonText: '再看看'
        })
          .then(() => {
            // on confirm
            this.$router.push({
              path: '/upauthimg'
            })
          })
          .catch(() => {
            // on cancel
          })
      }
    },
    // 上报收听次数
    add () {
      var pageCode = '8'
      var code = this.value.code
      var data = {
        pageCode,
        code
      }
      this.reportReadNum(data)
    },
    // 播放录音
    play () {
      if (this.voiceUrl.answerUrl != this.value.academicAnswer[0].answerUrl) {
        // 当前播放器播放的录音不是此录音
        console.log(123)
        this.$emit('setUrl', this.value.academicAnswer[0]) //  将当前需要播放的信息传给父组件  更新公共播放信息
        this.player.src = this.value.academicAnswer[0].answerUrl
        this.player.load()
        this.player.play()
        this.playing = true
        try {
          // 埋点
          this.baoSaveReport({
            PageName: '组件-学术同期声列表',
            EventID: '2',
            ControlName: '播放录音',
            Description: this.value.code
          })
        } catch (error) {
          console.log(error)
        }

        if (this.canReport) {
          this.add()
          this.canReport = false
          setTimeout(() => {
            this.canReport = true
          }, 10000)
        }
      } else {
        // 播放器播放的是当前组件的录音
        if (this.playing) {
          // 如果在播放中则暂停
          this.player.pause()
          this.playing = false
        } else {
          // 不在播放中就播放
          this.player.play()
          this.playing = true
        }
      }
    },
    toDetail () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-学术同期声列表',
          EventID: '2',
          ControlName: '详情跳转',
          Description: this.value.code
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/answerDetail',
        query: {
          code: this.value.code,
          source: this.source || 12
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url("src1/stylequestion.less");
</style>
