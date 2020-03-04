<template>
  <!-- 播放器组件 -->
  <div class="audio-play-box">
    <audio id="audio">
      <!-- <source src="../../assets/audio/123.mp3" type="audio/mp3" /> -->
    </audio>
    <!-- 播放按钮 -->
    <div class="play-icon" @click="playAudio" :class="{'pause':pauseing}"></div>
    <div class="right">
      <!-- 播放进度条 -->
      <div class="progress-bar-box">
        <div :style="{'width':currentTime || '0%'}" class="blue">
          <div class="point"></div>
        </div>
      </div>
      <!-- 收听数和时长显示 -->
      <!-- <div class="readNum-duration-box">
        <div class="read-num">
          <p class="read-icon"></p>
          <p>{{ item.readNum }}</p>
        </div>
        <div class="zan" v-if="showZan">{{ item.praiseNum }}</div>
        <div class="duration">{{minites}}:{{seconds}}</div>
      </div>-->
    </div>
  </div>
</template>

<script>
import storage from 'storejs'
// import base from '../../store/modules/base';

export default {
  props: {
    item: [Object]
  },
  data () {
    return {
      audio: {},
      currentTime: '30',
      minites: 0,
      seconds: 0,
      timer: '',
      pauseing: false,
      playing: false,
      showZan: false
    }
  },
  mounted () {
    // if(location.href.indexOf('meeting') != -1) {
    //     this.showZan=true
    // }else {
    //     this.showZan = false
    // }
    // this.audio  = document.getElementById('audio')
    this.audio = new Audio()
    // this.timer = setInterval(() => {
    //     if()
    // },10)
    this.audio.src = this.item ? this.item.answerUrl : ''
    // this.audio.onload = function(){
    // }
    // EventUtil.addHandler(this.audio,"load",function(){
    //     event = EventUtil.getEvent(event);
    //     alert(EventUtil.getTarget(event).src);
    // });
    // this.audio.addEventListener('load',() => {
    //     console.log(this.audio.duration)
    // })
    // console.dir(this.audio)
    // console.dir(Math.floor(this.audio.duration))
    // alert(JSON.stringify(this.audio.currentTime))
    this.audio.load()
    var t = 0
    // var loadtimeid = setInterval(() => {
    // alert(this.audio.duration)
    // console.dir(Math.ceil(this.audio.duration))
    // if(isNaN(this.audio.duration)|| this.audio.duration){

    // }else {
    //     // alert(this.audio.duration)
    //      // console.log(Math.ceil(this.audio.duration))
    //     var duration = Math.ceil(this.audio.duration)
    //     this.minites = '0' + parseInt(duration/60)
    //     this.seconds = duration % 60
    //     clearInterval(loadtimeid)
    // }
    /* this.audio.ondurationchange = () => {

            } */
    var duration = Math.ceil(this.item.voiceDuration)
    this.seconds = duration
    // },10)
    // this.audio.loadedmetadata(() => {
    //     console.log(this.audio.duration)
    // })
    // console.dir(this.audio)
  },
  methods: {
    // 上报收听次数
    add () {
      var { areaCode, encrypt } = storage.get(process.env.VUE_APP_STORAGE_NAME)
      var pageCode = '8'
      var code = this.item.code
      var data = {
        areaCode,
        pageCode,
        code
      }
      this.$http.post(process.env.VUE_APP_API_HOST + '/common/content/read/up/add', JSON.stringify(data), {
        headers: {
          'encrypt': encrypt
        }
      }).then(res => {
      })
    },
    // 音频播放
    playAudio () {
      if (this.audio != null) {
        // 判断是否已经暂停  如果暂停中  点击就播放   如果不是  点击就暂停
        if (this.audio.paused) {
          this.audio.play()
          this.pauseing = true
          var url = location.href
          var timeid = setInterval(() => {
            if (location.href != url) {
              this.audio.pause()
              clearInterval(this.report_article_timer)
              clearInterval(timeid)
            }
            this.currentTime = this.audio.currentTime / this.item.voiceDuration * 100 + '%'
            var duration = Math.ceil(this.item.voiceDuration - this.audio.currentTime)
            this.minites = '0' + parseInt(duration / 60)
            this.seconds = duration % 60
            if (this.seconds < 10) {
              this.seconds = '0' + this.seconds
            }
            if (this.seconds == 0 && this.minites == 0) { clearInterval(timeid) }
          }, 1000)
          //   上报时长
          if (this.report_article_timer) {
            clearInterval(this.report_article_timer)
          }
          var url = location.href
          this.report_article_timer = setInterval(() => {
            if (location.href != url) {
              clearInterval(this.report_article_timer)
            }
            let userId = storage.get(process.env.VUE_APP_STORAGE_NAME).userId || ''
            let data = {
              userId: userId,
              type: this.item.type,
              code: this.item.code,
              logType: '2',
              viewId: '',
              companyCode: 'DYSG-GS',
              areaCode: 'AMYXY'
            }
            this.$http.post(process.env.VUE_APP_API_HOST + '/common/report/time/save', JSON.stringify(data),
              { emulateJSON: true,
                headers: { 'Content-Type': 'application/json;charset=UTF-8' }
              }).then((res) => {
              if (res.body.code == 0) {
                //   Toast(res.body.msg);

              }
            })
          }, 5000)
          // 控制收听次数不能再10秒内重复增加
          if (!this.playing) {
            this.playing = true
            this.add()
            setTimeout(() => {
              this.playing = false
            }, 10000)
          }
          var ended = setInterval(() => {
            if (this.seconds == 0 && this.minites == 0) {
              clearInterval(this.report_article_timer)
              clearInterval(ended)
              this.pauseing = false
            }
          }, 1000)
        } else {
          this.audio.pause()
          this.pauseing = false
          clearInterval(this.report_article_timer)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.audio-play-box {
  height: 0.5rem;

  .play-icon {
    width: 0.4rem;
    height: 0.4rem;
    background: url("src1/assets/icons/audio_play.png") no-repeat center
      center;
    background-size: 100% 100%;
    float: left;
  }
  .pause {
    background: url("src1/assets/icons/puase-audio.png") no-repeat center
      center;
    background-size: 100% 100%;
  }
  .right {
    height: 100%;
    overflow: hidden;
    position: relative;
    padding: 0.5rem 15px 0;
    // 进度条
    .progress-bar-box {
      width: 100%;
      height: 2px;
      border-radius: 2px;
      position: absolute;
      top: 0.2rem;
      background-color: #e9e9e9;
      z-index: 1;

      .point {
        width: 8px;
        height: 8px;
        background-color: #806aff;
        border-radius: 4px;
        position: absolute;
        right: -4px;
        top: -3px;
        z-index: 100;
      }
      .blue {
        width: 0%;
        height: 100%;
        background-color: #806aff;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
      }
    }
    // 收听数和时长盒子
    .readNum-duration-box {
      color: #999999;
      width: 100%;
      height: 0.2rem;
      position: absolute;
      top: 0.3rem;
      left: 0;
      padding: 0 15px;
      line-height: 0.2rem;
      font-size: 10px;
      // 收听数
      .read-num {
        // width: 100px;
        line-height: 0.25rem;
        float: left;
        p {
          float: left;
          padding: 0 5px;
        }
        .read-icon {
          width: 0.13rem;
          height: 0.2rem;
          background: url("src1/assets/icons/read.png") no-repeat center
            center;
          background-size: 100% auto;
        }
      }

      .duration {
        float: right;
      }
    }
  }
}
.zan {
  // width: 30%;
  height: 0.2rem;
  padding-left: 0.18rem;
  line-height: 0.25rem;
  float: left;
  // background: url("../../assets/icons/icon-r.png") no-repeat left center;
  background-size: 0.13rem 0.13rem;
  color: #ddd;
  margin-left: 5px;
  color: #999999;
}
</style>
