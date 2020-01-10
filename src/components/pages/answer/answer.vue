<template>
  <div class="answerWrap">
    <div class="question">
      <div class="info">
        <div class="me"  v-if="info.isUser == '1'">本人</div>
        <div class="title">{{info.question}}</div>
      </div>
    </div>
    <div class="bottom">
      <div class="answer">
        <p>语音解答</p>
        <div class="answerBox">
          <div v-if="status==='1'" class="stop">
            <div class="icon" @click="start"></div>
            <div class="txt">点击开始录音</div>
          </div>
          <div v-if="status==='2'" class="start">
            <div class="txt" data-flex="main:center cross:center">
              <span class="now">{{num}}s</span>&nbsp;/&nbsp;
              <span class="all">59s</span>
            </div>
            <div class="prograss">
              <circleProgress
                v-model="currentRate"
                :stroke-width="20"
                :color="'#4731DE'"
                :rate="rate"
                :size="'100px'"
              >
                <div class="icon" @click="stop"></div>
              </circleProgress>
            </div>
          </div>
          <div v-if="status==='3'" class="end">
            <div class="txt" data-flex="main:center cross:center">
              <span class="now">{{num}}s</span>&nbsp;/&nbsp;
              <span class="all">59s</span>
            </div>
            <div class="icon" @click="send"></div>
            <div class="btnBox" data-flex="main:justify cross:center">
              <span style="color:#4A4A4A" @click="cancel">取消</span>
              <span style="color:#4631DC" @click="tryListen">试听
                <img class="try" v-show="showTry" src="../../../assets/images/playing.gif" alt="">
              </span>
            </div>
          </div>
          <div v-if="status==='4'" class="play">
            <audio-info v-if="myAnswer" :item="myAnswer"></audio-info>
            <span class="record" v-show="myAnswer.status != 'B'" @click="recordAgain">重新录制</span>
          </div>
        </div>
      </div>
      <div class="info">
        <div data-flex="main:left cross:top">
          <div class="left">备注：</div>
          <div class="center">
            <p>1、审核通过后，不再允许修改</p>
            <p>2、可以录制59秒的语音</p>
          </div>
          <div class="right">
            <!-- <p v-if="status==='4'">审核中</p> -->
            <div
              v-if="status==='4'"
              class="audit-state"
              :style="{'color':colorList[auditState]}"
            >{{auditText[auditState]}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { Circle, Toast, Dialog } from 'vant'
import serviceApi from '../../../core/serviceAPI.js'
import { baseUrl } from '../../../interfaceUrl'
import storage from 'storejs'
import audioInfo from './audioInfo'
import { getJsTicket, getQuery } from '../../../utils/auth'
import { _getArticleList } from '../../../utils/api'
import encode from '../../../utils/encode'
import { changeTitle } from '../../../utils/func'
import share from '../../../utils/share'
export default {
  components: {
    circleProgress: Circle,
    audioInfo
  },

  data () {
    return {
      code: this.$route.query.code, // 问题code===路由
      isMine: true, // 问题是否是自己的
      info: {}, // 问题详细信息
      currentRate: 0, //
      status: '1', // 1未开始录音  2：录音状态 3：录音结束带发送装填  4：发送成功状态
      auditState: 'A',
      colorList: { A: '#BABABA', C: '#CC0000', B: '#00990C' },
      // 审核状态文本的数组
      auditText: { A: '审核中', B: '已通过', C: '未通过' },
      rate: 100,
      num: 0,
      recordTimer: '',
      // speed: 0,
      // 存储语音下载链接
      asd: '',
      // 存储语音信息对象
      voice: {},
      loading: false,
      // 存储自己回答的信息
      myAnswer: {},
      showTry: false
    }
  },
  created () {
    this.getQuestion()
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '学术同期声',
        EventID: '2',
        ControlName: '添加提问',
        Description: '进入提问'
      })
    } catch (error) {
      console.log(error)
    }
  },
  mounted () {
    changeTitle('语音回答')
    this.hideLoad()
    // this.getInfo();
    this.record()
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    recordAgain () {
      if (!/MicroMessenger/i.test(navigator.userAgent)) {
        // 判断当前是否微信环境
        Toast(
          '当前语音回答只支持微信环境，请更换微信登录尝试回答问题！给您造成不便，敬请谅解！'
        )
        return
      }
      Dialog.confirm({
        title: '提示',
        message: '确定重新录制语音？'
      })
        .then(() => {
          this.num = 0
          this.status = '1'
          wx.stopVoice({
            localId: this.voice.localId
          })
        })
        .catch(() => {})
    },
    // 获取问题详情
    async getQuestion () {
      const { code, source } = this.$route.query
      var userId = storage.get(process.env.VUE_APP_STORAGE_NAME).userId
      var time = new Date()
      time = time.getTime()
      var data = {
        companyCode: 'DYSG-GS',
        timestamp: time,
        code
      }
      try {
        var res = await serviceApi.getQuestionDetail(data)
        this.info = res.data
        share({
          title: this.info.question,
          desc: '',
          link: `${location.origin}${location.pathname}#/answerDetail?shareEncryptKey=${this.info.shareEncryptKey}&id=${this.info.id}&code=${this.info.code}&source=16`,
          imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg',
          shareEncryptKey: this.info.shareEncryptKey,
          type: this.info.type
        })
        this.btnclassIndex = this.info.isAnswer
        if (this.btnclassIndex == 0) {
          Dialog.alert({
            message: '吐字清晰能够更快审核通过哦！'
          }).then(() => {
            // on close
          })
        } else {
          this.myAnswer = this.info.academicAnswer.find(ele => {
            return ele.userId == userId
          })
          this.auditState = this.myAnswer.status
          this.status = '4'
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取token
    async getToken (serverId) {
      console.log('serverId', serverId)
      const data = {
        appid: process.env.VUE_APP_APPID
      }
      try {
        const res = await serviceApi.getAccessToken(data)
        var token = res.data.accessToken
        // 下载微信服务器语音文件
        this.asd =
          'https://api.weixin.qq.com/cgi-bin/media/get?access_token=' +
          token +
          '&media_id=' +
          serverId

        const { userId, companyCode, areaCode, encrypt } = storage.get('amyxy')
        var time = new Date()
        time = time.getTime()
        var param = {
          userId,
          companyCode,
          areaCode,
          timestamp: time,
          code: this.$route.query.code,
          answerUrl: this.asd,
          voiceDuration: ''
        }
        console.log(2)
        this.sendRecord(param)
      } catch (error) {
        console.log(error)
        // Toast(error)
      }
    },

    // send
    async sendRecord (param) {
      this.loading = false
      try {
        const res = await serviceApi.addRecord(param)
        this.myAnswer.answerUrl = res.data.audioUrl
        this.myAnswer.voiceDuration = res.data.voiceDuration
        this.myAnswer.readNum = 0
        this.status = '4'

        try {
          this.loading = false // 发送成功 重置状态
          // 埋点
          this.baoSaveReport({
            PageName: '学术同期声',
            EventID: '2',
            ControlName: '发送答案',
            Description: '发送成功'
          })
        } catch (error) {
          console.log(error)
        }
        if (res.data.score && res.data.score > 0) {
          Toast('回答成功\n积分+' + res.data.score)
        }
      } catch (error) {
        console.log(error)
        Toast(error)
      }
    },

    // f发送
    send () {
      try {
      // 埋点
        this.baoSaveReport({
          PageName: '学术同期声',
          EventID: '2',
          ControlName: '发送答案',
          Description: '点击发送'
        })
      } catch (error) {
        console.log(error)
      }
      console.log(this.voice, 'this.voice.localId')
      console.log(this.loading, 'this.loading')
      if (this.loading) {
        return
      }
      this.loading = true
      wx.uploadVoice({
        // localId: ele, // 需要上传的音频的本地ID，由stopRecord接口获得
        localId: this.voice.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: res => {
          // Toast(res.serverId)
          console.log(res)
          this.getToken(res.serverId)
        },
        error: err => {
          console.log(err, 'err--wx')
        }
      })
    },

    // 取消
    cancel () {
      try {
      // 埋点
        this.baoSaveReport({
          PageName: '学术同期声',
          EventID: '2',
          ControlName: '取消',
          Description: '取消当前录音'
        })
      } catch (error) {
        console.log(error)
      }
      // 判断当前是否在发送页面
      this.status = '1'
      this.num = 0
      // 通知适应的录音
      wx.stopVoice({
        localId: this.voice.localId // 需要停止的音频的本地ID，由stopRecord接口获得
      })
    },

    //  试听
    tryListen () {
      try {
      // 埋点
        this.baoSaveReport({
          PageName: '学术同期声',
          EventID: '2',
          ControlName: '试听',
          Description: ''
        })
      } catch (error) {
        console.log(error)
      }
      this.showTry = true
      wx.playVoice({
        localId: this.voice.localId
      })
    },

    // 结束录音s
    stop (event) {
      if (event) {
        event.preventDefault()
      }
      wx.stopRecord({
        success: res => {
          clearInterval(this.recordTimer)
          this.voice.localId = res.localId
          this.status = '3'
          // this.speed = 0;
        },
        fail: res => {
          alert(JSON.stringify(res))
        }
      })
    },

    // 开始录音
    start (event) {
      this.currentRate = parseInt((this.num / 59) * 100)
      this.status = '2'
      clearInterval(this.recordTimer)
      event.preventDefault()
      wx.startRecord({
        success: () => {
          this.currentRate = parseInt((this.num / 59) * 100)
          localStorage.rainAllowRecord = 'true'
          this.recordTimer = setInterval(() => {
            // this.rate += 1;
            this.num += 1
            // this.speed = 100/40;
            this.currentRate = parseInt((this.num / 59) * 100)
            console.log(this.currentRate)
            console.log(this.rate)
            // console.log(this.rate);
            if (this.num >= 59) {
              clearInterval(this.recordTimer)
              this.speed = 0
            //   this.stop();
            }
          }, 1000)
        },
        cancel: () => {
          alert('用户拒绝授权录音')
        }
      })
      wx.onVoiceRecordEnd({
        complete: (res) => {
          console.log('onVoiceRecordEnd')
          clearInterval(this.recordTimer)
          this.voice.localId = res.localId
          this.status = '3'
        }
      })
    },

    // 获取问题详情
    async getInfo () {
      const data = {
        code: this.$route.query.code,
        source: this.$route.query.source || ''
      }
      try {
        var res = await serviceApi.getQuestionDetail(data)
        this.info = res.data
        console.log(this.info)
      } catch (error) {
        console.log(error)
      }
    },

    // 录音设备检测
    record () {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        var encrypt = storage.get('amyxy').encrypt
        getJsTicket(encrypt).then(res => {
          // res = JSON.parse(encode.decodeFuc(res.data.data));
          var data = JSON.parse(encode.decodeFuc(res.data.data))
          if (data.code != 200) {
            // MessageBox.confirm(encrypt)
            Toast('获取权限失败，请稍后再试')
          } else {
            const signParams = Object.assign({}, data.body, {
              debug: false,
              jsApiList: [
                'startRecord', // 开始录音
                'stopRecord', // 停止录音
                'onVoiceRecordEnd', // 监听录音自动停止接口
                'playVoice', // 播放录音
                'pauseVoice', // 暂停云隐接口
                'stopVoice', // 停止播放
                'onVoicePlayEnd', //
                'uploadVoice', // 上传语音
                'downloadVoice' // 下载语音
              ]
            })
            signParams.appId = process.env.VUE_APP_APPID
            wx.config(signParams)
            // console.log(wx);
            wx.ready(() => {
              wx.onVoiceRecordEnd({
                complete: res => {
                  this.voice.localId = res.localId
                  clearInterval(this.recordTimer)
                }
              })

              wx.onVoicePlayEnd({
                success: res => {
                  var localId = res.localId // 返回音频的本地ID
                  this.showTry = false
                }
              })
            })
          }
        })
      } else {
      }
    }
  }
}
</script>

<style lang="less" scoped>
.answerWrap {
  background: #f8f8f8;
  height: 100%;
}
.record {
  display: block;
  font-size: 0.14rem;
  font-weight: 400;
  color: rgba(183, 150, 255, 1);
  line-height: 0.2rem;
  margin-top: 0.4rem;
}
.bottom {
  height: 75%;
  background: #fff;
  padding: 0.1rem 0.12rem;
  .answer {
    p {
      font-size: 0.15rem;
      font-weight: 500;
      color: rgba(74, 74, 74, 1);
      line-height: 0.4rem;
      text-align: left;
    }
    .answerBox {
      width: 3.5rem;
      height: 1.8rem;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
      border-radius: 0.08rem;
      margin: 0.1rem auto;
    }
    .play {
      padding: 0.5rem 0.2rem 0;
    }
    .end {
      padding-top: 0.35rem;
      .icon {
        margin: 0 auto;
        width: 1rem;
        height: 1rem;
        background: url("../../../assets/icons/send_record.png");
        background-size: 1rem 1rem;
      }
      .btnBox {
        height: 0.3rem;
        line-height: 0.3rem;
        padding: 0 0.4rem;
        .try {
          width: 0.15rem;
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .stop {
      padding-top: 0.35rem;
      .icon {
        margin: 0 auto;
        width: 1rem;
        height: 1rem;
        background: url("../../../assets/icons/stop.png");
        background-size: 1rem 1rem;
      }
      .txt {
        margin: 0.1rem 0 0.1rem;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        .now {
          color: rgba(80, 36, 231, 1);
          text-align: right;
          width: 50%;
        }
        .all {
          color: #9b9b9b;
          width: 50%;
          text-align: left;
        }
      }
    }
    .start {
      padding: 0.05rem 0 0;
      .txt {
        margin: 0.1rem 0 0.1rem;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        .now {
          color: rgba(80, 36, 231, 1);
          text-align: right;
          width: 50%;
        }
        .all {
          color: #9b9b9b;
          width: 50%;
          text-align: left;
        }
      }
    }
    .prograss {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 auto;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      // box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.4);
      align-items: center;
      .icon {
        width: 100px;
        height: 100px;
        background: url("../../../assets/icons/play_recored.png");
        position: absolute;
        left: 0px;
        top: 0px;
        background-size: 100px 100px;
        z-index: 99;
      }
    }
  }
  .info {
    padding-top: 0.2rem;
    line-height: 0.28rem;
    .left {
      width: 12%;
    }
    .center {
      width: 70%;
    }
    .right {
      width: 12%;
      p {
        width: 0.6rem;
        height: 0.3rem;
        text-align: center;
        background: rgba(216, 216, 216, 1);
        border-radius: 0.05rem;
        line-height: 0.3rem;
        color: #9b9b9b;
      }
    }
    text-align: left;
    p {
      font-size: 0.14rem;
      font-weight: 400;
      color: rgba(74, 74, 74, 1);
    }
  }
}
.question {
  background: #fff;
  padding: 0.1rem 0.12rem 0.3rem;
  margin-bottom: 02%;
  .info {
    height: 1rem;
    overflow-y: auto;
  }
  .me {
    text-align: left;
    font-size: 0.15rem;
    font-weight: 500;
    color: rgba(74, 74, 74, 1);
    line-height: 0.26rem;
    margin-bottom: 0.1rem;
  }
  .title {
    font-size: 0.14rem;
    font-weight: 400;
    color: rgba(74, 74, 74, 1);
    line-height: 0.2rem;
    text-align: left;
  }
}
</style>
