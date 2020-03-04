<template>
  <div>
    <div class="video-player" id="video-player" :style="{background: `url(${this.item.thumbnailUrl}) no-repeat center center` ,backgroundSize:'100% auto'}">
      <div class="playicon" @click="play" v-if="!player && (item.broadcastStatus == 'D' || !item.broadcastStatus || canPlay)"></div>
      <div class="playicon" @click="playLive" v-if="!player && (item.broadcastStatus == 'A' || canPlay)"></div>
      <div class="living" v-show="item.broadcastStatus == 'A'">直播中</div>
      <div class="mask" v-if="(item.broadcastStatus == 'B' || item.broadcastStatus == 'C') && !canPlay"></div>
      <div class="time" v-if="(item.broadcastStatus == 'B' || item.broadcastStatus == 'C') && !canPlay">
        <div class="item txt">距直播开始</div>
        <div class="item info day">{{ day }}天</div>
        <div class="item info hour">{{ month }}时</div>
        <div class="item info minite">{{ hour }}分</div>
        <div class="item info second">{{ second }}秒</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Toast, Dialog } from 'vant'
export default {
  props: {
    options: {
      type: Object,
      default () {
        return {
          mimeType: 'video/mp4',
          preload: true,
          hideMediaControl: true,
          width: '100%',
          height: '100%',
          playInline: true,
          x5PlaySinline: true
        }
      }
    }, // 视频控件默认选项

    // 文章详情
    /**
     * @param {Object} item-请求参数
     * @param {String} item.code-code
     * @param {Number} item.type--文章类型
     * @param {Number} item.viewId--viewId
     * @param {Number} item.thumbnailUrl--视频背景图Url
     * @param {Number} item.videoUrl--视频播放Url
     */
    item: {
      type: Object
    },
    isActive: {
      type: Boolean,
      default: false
    } // 是否激活，未激活时只显示背景图
  },
  computed: {},
  mounted () {
    console.log('mounted', this.item)
    if (this.item.code) {
      this.initVoice()
    }
  },
  data () {
    return {
      player: null, // 播放器对象
      showPlay: false, // 是否显示播放按钮
      backgroundStyle: '', // 背景样式
      report_video_timer: 0, // 上报视频播放时长的计时器
      upreported_video: 0, // 上报医米积分的定时器
      day: '00',
      month: '00',
      hour: '00',
      second: '00',
      canPlay: false,
      getTimer: '',
      playTimer: ''
    }
  },
  methods: {
    ...mapActions({
      reportUserTime: 'content/reportUserTime', // 上报用户访问时长
      reportJfUp: 'content/reportJfUp', // 上报积分
      getVideoTime: 'content/getVideoTime',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    initVoice () {
      console.log(1)
      if (!this.item.broadcastStartTime) {
        console.log(123)
        return
      }
      console.log(2)
      var now = new Date()
      var start = new Date(this.item.broadcastStartTime.replace(/-/gi, '/'))
      var t = now - start
      if (t > 0) {
        // 直播已开始
        console.log(5)
        this.notStart = false
      } else {
        console.log(4)
        t = Math.abs(parseInt(t / 1000))
        this.getTime(t)

        var timer = setInterval(() => {
          if (t <= 0) {
            this.canPlay = true
            return
          }
          this.getTime(t)
          t = t - 1
        }, 1000)
      }
    },
    getTime (t) {
      this.day = parseInt(t / 60 / 60 / 24) < 10 ? '0' + parseInt(t / 60 / 60 / 24) : parseInt(t / 60 / 60 / 24)
      this.month = parseInt(t / 60 / 60) % 24 < 10 ? '0' + parseInt(t / 60 / 60) % 24 : parseInt(t / 60 / 60) % 24
      this.hour = parseInt(t / 60) % 60 < 10 ? '0' + parseInt(t / 60) % 60 : parseInt(t / 60) % 60
      this.second = t % 60 < 10 ? '0' + t % 60 : t % 60
    },
    play () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-详情页视频播放器',
          EventID: '2',
          ControlName: '播放',
          Description: location.href
        })
        const video = document.getElementById('video-player')
        // 设置配置
        const options = this.options
        options.poster = this.item.thumbnailUrl
        options.source = {
          source: this.item.videoUrl,
          mimeType: options.mimeType
        }
        // 初始化视频组件
        this.backgroundStyle = ''
        // this.showPlay = false;
        const player = new Clappr.Player(options)
        player.attachTo(video)
        this.player = player
        console.log(this.player)
        const self = this

        player.play()
        // 视频播放
        player.on('play', () => {
          // 每5秒（默认）一次上传访问时长
          clearInterval(self.report_video_timer)
          self.report_video_timer = setInterval(() => {
            const data = {
              type: self.item.type,
              code: self.item.code,
              logType: '2', // 上传时长用 1、停留时长 2、播放时长
              viewId: self.item.viewId
            }
            self.reportUserTime(data)
          }, 5000)

          // 积分上报接口 30秒上传
          this.integralReport()
          // if (process.env.VUE_APP_AREA_CODE === 'YBZTC' && this.item.type === '3') {
          //   this.YbReport();
          // }
        })
        // 视频暂停
        player.on('pause', () => {
          clearInterval(self.report_video_timer)
          clearTimeout(this.upreported_video)
        })
        // 视频停止
        player.on('ended', () => {
          clearInterval(self.report_video_timer)
        })
        console.log(4)
      } catch (error) {
        console.log(error)
      }
    },
    // 上报时长
    reportTime (logType, videoType) {
      const data = {
        code: this.$route.query.code,
        type: this.item.type,
        viewId: this.item.viewId,
        logType: `${logType}`,
        videoType: `${videoType}`
      }
      try {
        this.reportUserTime(data)
      } catch (error) {
        console.log(error)
      }
    },
    // 直播播放器初始化
    playLive () {
      const that = this
      this.player = new TcPlayer('video-player', {
        m3u8: that.item.livePullUrlHls, // 请替换成实际可用的播放地址
        autoplay: true, // iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
        // coverpic: {
        //   style: 'stretch',
        //   src: that.content.thumbnailUrl,
        // },
        x5_player: true, // 兼容部分android 无法播放
        // controls: 'system',
        live: true,
        // listener: {
        //   playing() {
        //     console.log(123123);
        //   },
        // },
        listener (msg) { // 事件监听
          // console.log(msg);
          if (msg.type === 'play') {
            that.playTimer = setInterval(() => {
              console.log(123)
              that.reportTime(2, 1)
            }, 5000)
            // 积分上报接口 30秒上传
            this.integralReport()
          }
          if (msg.type === 'pause') {
            if (that.playTimer) {
              clearInterval(that.playTimer)
            }
            clearTimeout(this.upreported_video)
          }
          if (msg.type === 'ended') {
            that.player.destroy()
          }
          // console.log(msg);
          if (msg.type === 'error') {
            if (that.getTimer) {
              clearInterval(that.getTimer)
            }
            if (that.playTimer) {
              clearInterval(that.playTimer)
            }
            if (msg.detail.code === 2) {
              // MessageBox({
              //   title: '',
              //   message: '<p style=\'color:#45C144;font-size:16px;\'>出错啦!</p><p>网络错误,刷新再试试吧!</p>',
              //   confirmButtonClass: 'know-that',
              //   confirmButtonText: '我知道了',
              // }).then(() => {
              //   // location.reload();
              // });
              Dialog.alert({
                title: '',
                message: '<p style=\'color:#45C144;font-size:16px;\'>出错啦!</p><p>网络错误,刷新再试试吧!</p>'
              }).then(() => {
                // on confirm
              }).catch(() => {
                // on cancel
              })
            }
            // if (this.playTimer) {
            //   clearInterval(this.playTimer);
            // }

            // that.player.destroy();
            // location.reload();
          }
        }
      })
      this.player.play()
    },
    // 控件初始化，查询设置视频播放插件及上报用户访问时长
    async init () {
      console.log('item', this.item)
      // this.item.videoUrl = 'http://studioimage.yxj.org.cn/1530785917051.mp4';
      try {
        if (!this.item.videoUrl) {
          console.log(789789)
          return
        }
        console.log(456456)
        // 如果播放器存在则效果
        if (this.player) {
          this.player.destroy()
          this.player = null
        }
        // 如果未激活只显示背景图
        this.backgroundStyle = `url(${
          this.item.thumbnailUrl
        }) no-repeat center center`
        this.showPlay = true
      } catch (error) {
        console.log(error)
      }
    },
    integralReport () { // 积分上报
      clearTimeout(this.upreported_video)
      this.upreported_video = setTimeout(() => {
        const dataBao = {
          type: '2',
          code: this.item.code
        }
        this.reportJfUp(dataBao).then((res) => {
          if (res.code === 0) {
            //   Toast(res.body.msg);
          } else if (res.data.isFlag === true) {
            Toast(`+${res.data.score}积分`)
          }
        })
      }, 30000)
    }
  },
  watch: {
    item () {
      console.log(123456789)
      console.log('0211121234564534', this.player)
      if (this.player) {
        this.player.destroy()
        this.player = null
      }
      this.initVoice()
      clearInterval(this.report_video_timer)
      clearTimeout(this.upreported_video)
    }
  },
  beforeDestroy () {
    if (this.player) {
      this.player.destroy()
    }
  },
  updated () {},
  // 页面摧毁是清空定时器
  destroyed () {
    clearInterval(this.report_video_timer)
    clearTimeout(this.upreported_video)
  }
}
</script>
<style lang="less" scoped>
.video-player {
  width: 100%;
  height: 2rem;
  overflow: hidden;
  background-size: 100% auto !important;
}
.playicon {
  width: 100%;
  height: 100%;
  display: block;
  background: url("src1/assets/icons/playicon.png") no-repeat center center;
  background-size: 40px 48px;
  z-index: 3;
}
.living {
  // width:40px;
  padding: 0 5px;
  height:20px;
  background:linear-gradient(135deg,rgba(255,204,136,1) 0%,rgba(255,171,136,1) 100%);
  border-radius:0px 0px 4px 0px;
  color: #fff;
  position: absolute;
  left: 0;
  top: 0;
}
.time {
  width: 70%;
  display: flex;
  justify-content:space-between;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  color: #fff;
  line-height: 26px;
  &.video {
    top: 30%;
  }
  .info {
    background:linear-gradient(140deg,rgba(255,204,136,1) 0%,rgba(255,170,136,1) 100%);
    border-radius: 4px;
    padding: 0 3px;
  }
}
.mask {
  width: 100%;
  height: 100%;
  padding-top: 50%;
  background:rgba(93,38,255,0.5);
  position: absolute;
  top: 0;
  left: 0;
}
</style>
