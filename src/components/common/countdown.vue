<template>
  <div class="countdown" @click.stop="toDetail">
    <div class="img" :class="{'video':video}">
      <img :src="value.liveCoverUrl || value.topUrl || value.thumbnailUrl" alt="">
      <div class="mask" v-if="value.broadcastStatus != 'A'"></div>
      <div class="status" v-if="value.broadcastStatus == 'A'">直播中</div>
    </div>
    <div class="time"  :class="{'video':video}" v-if="(value.broadcastStatus == 'B' || value.broadcastStatus == 'C') && !canPlay">
      <div class="item txt">距直播开始</div>
      <div class="item info day">{{ day }}天</div>
      <div class="item info hour">{{ month }}时</div>
      <div class="item info minite">{{ hour }}分</div>
      <div class="item info second">{{ second }}秒</div>
    </div>
    <div class="play-icon"  :class="{'video':video}" v-if="value.broadcastStatus == 'A' || canPlay">
      <img src="../../assets/icons/playicon.png" alt="">
    </div>
    <div>
      <img src="" alt="">
    </div>
    <div class="title">
      <div class="info">
        主题：{{ value.articleTitle || value.title || value.videoTitle || value.meetingTitle }}
      </div>
      <div class="add-btn" @click.stop="applyMeeting">{{ liveStatusName }}</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Dialog } from 'vant'
export default {
  props: {
    value: {
      type: Object
    },
    video: {
      type: Boolean
    }
  },
  created () {
    console.log(this.value)
    if (this.value.broadcastStatus == 'C') {
      this.liveStatusName = '已报名'
    } else if (this.value.broadcastStatus == 'A') {
      this.liveStatusName = '直播中'
    }
    this.init()
  },
  data () {
    return {
      day: '',
      month: '',
      hour: '',
      second: '',
      notStart: true,
      liveStatusName: '报名',
      canPlay: false
    }
  },
  methods: {
    ...mapActions({
      liveAdd: 'content/liveAdd',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    toDetail () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-直播海报',
          EventID: '2',
          ControlName: '跳转详情',
          Description: this.value.code || ''
        })
      } catch (error) {
        console.log(error)
      }
      if (this.value.type == 2) {
        this.$router.push({
          path: '/meetingDetail',
          query: {
            code: this.value.code,
            source: 12
          }
        })
      } else if (this.value.type == 3) {
        this.$router.push({
          path: '/videoDetail',
          query: {
            code: this.value.code,
            source: 12
          }
        })
      }
    },
    init () {
      var now = new Date()
      var start = new Date(this.value.broadcastStartTime.replace(/-/gi, '/'))
      var t = now - start
      if (t > 0) {
        // 直播已开始
        this.notStart = false
      } else {
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
    // 报名
    applyMeeting () {
      if (this.liveStatusName == '已报名') {
        return
      }
      if (this.value.broadcastStatus === 'B') {
        try {
          // 埋点
          this.baoSaveReport({
            PageName: '组件-直播海报',
            EventID: '2',
            ControlName: '直播报名',
            Description: this.value.code || ''
          })
        } catch (error) {
          console.log(error)
        }
        var data = {
          code: this.value.code,
          type: this.value.type
        }
        this.liveAdd(data).then(res => {
          if (res.code == 1) {
            this.liveStatusName = '已报名'
            var dataSource = this.dataSource
            this.dataSource = ''

            this.dataSource = dataSource
            Dialog.alert({
              title: '报名成功',
              message: '上课时间：' + this.value.broadcastStartTime + '\n请留意系统上课通知'
            })
          }
        })
      }
    }
  },
  watch: {
    value () {
      console.log(789789789)
      this.init()
    }
  }

}
</script>

<style lang='less' scoped>
@import url('../../style/countdown.less');
</style>
