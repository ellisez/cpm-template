<template>

<div class='list-item' @click.stop='clickDetail'>
  <div class='right fr'>
    <img :src='dataSource.thumbnailUrl' onerror='onerror=null;src="https://imageysz.yxj.org.cn/1553495609443.png"'/>
    <div class='play' v-if='dataSource.type=="3"||dataSource.type=="4"'></div>
    <div class='top' v-if='dataSource.isTop=="Y"'></div>
  </div>
  <div class='left'>
    <div class='article-title'>{{dataSource.title}}</div>
    <div class='nums'>

      <!-- 阅读数 -->
      <div v-if='dataSource.showReady && !time'  class='read fl' :class="{'fr':dataSource.showPushTime}">{{dataSource.readNum | numsFormat}}</div>

      <!-- 发表时间 -->
      <div v-if='dataSource.showPushTime'  class='fl'>发表时间：{{dataSource.pushTime}}</div>

      <!-- 点赞数 -->
      <div v-if='dataSource.showPraise' class='zan fl' :class="{'fr':dataSource.showPushTime}">{{dataSource.praiseNum | numsFormat}}</div>

       <!-- 直播时间 -->
      <div  v-if='dataSource.showTime && (value.broadcastStatus != "A" || !column)'  class='zb-time fr'>{{dataSource.liveTimeName}}</div>

      <!-- 直播状态 -->
      <div v-if='dataSource.showLiveStatus' class='zb-status' :class="{'fl':time,'fr':!time}" @click.stop='applyMeeting'>{{dataSource.liveStatusName}}</div>

       <!-- 已经结束的直播转成了视频 -->
      <div v-if='dataSource.showNb' class='zb-status fr' >回顾</div>

      <!-- 领域 -->
      <div v-if='dataSource.showLab && dataSource.labName' class='label fr'>{{dataSource.labName}}</div>

      <!-- 栏目 -->
      <div v-if='column && value.broadcastStatus == "A"' class='tab fr'>{{dataSource.columnName || dataSource.modelName}}</div>

       <!-- 发布日期 -->
      <div v-if='dataSource.issueDay' class='date fr'>{{dataSource.firstOnlineTimeUp}}</div>
    </div>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import { Dialog } from 'vant'
import util from '../../utils/util'
export default {
  props: {
    value: { type: Object },
    source: { type: [Number, String] },
    type: { type: String },
    praise: { type: Boolean },
    read: { type: Boolean },
    time: { type: Boolean },
    column: { type: Boolean },
    livestatus: { type: Boolean },
    day: { type: Boolean },
    pushtime: { type: Boolean },
    label: { type: Boolean },
    shownb: { type: Boolean }
  },
  data () {
    return {
      dataSource: null,
      areaCode: ''
    }
  },
  created () {
    this.ready()
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
  methods: {
    ...mapActions({
      liveAdd: 'content/liveAdd',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
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
    },
    // 报名
    applyMeeting () {
      if (this.dataSource.liveStatusName == '已报名') {
        return
      }
      if (this.value.broadcastStatus === 'B') {
        try {
          // 埋点
          this.baoSaveReport({
            PageName: '组件-通用列表',
            EventID: '2',
            ControlName: '直播报名',
            Description: this.value.code
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
            this.dataSource.liveStatusName = '已报名'
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
    },
    formatDate (item) {
      let self = this
      let nowTime = parseInt(new Date().getTime() / 1000)
      let date = item.broadcastStartTime || ''
      date = date.substring(0, 19)
      date = date.replace(/-/g, '/')
      var endTime = (new Date(date).getTime()) / 1000
      let t = endTime - nowTime
      if (t > 0) {
        let day = Math.floor(t / (3600 * 24))
        let hour = Math.floor(t / 3600)
        let min = Math.floor(t / 60)
        if (day > 0) {
          var timestamp = new Date(date).getTime()
          return util.time(timestamp).Format('MM月dd日 hh:mm')
        }
        if (hour > 0) {
          return '距开播' + hour + '小时'
        }
        if (hour <= 0 && min > 0) {
          return self.format = '距开播' + min + '分钟'
        }
      } else {
        let self = this
        let nowTime = parseInt(new Date().getTime() / 1000)
        let date = item.broadcastEndTime || ''
        date = date.substring(0, 19)
        date = date.replace(/-/g, '/')
        let endTime = (new Date(date).getTime()) / 1000
        let t = endTime - nowTime
        if (t > 0) {
          return '正在直播'
        } else {
          var timestamp = new Date(date).getTime()
          return util.time(timestamp).Format('MM月dd日')
        }
      }
    },
    // 列表页的点击事件
    clickDetail () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-通用列表',
          EventID: '2',
          ControlName: '详情跳转',
          Description: this.value.code
        })
      } catch (error) {
        console.log(error)
      }
      // 首先判断是否为外链
      if (this.dataSource.sourceUrl) {
        location.href = this.dataSource.sourceUrl
        return
      }
      var type = this.value.type || this.type
      switch (type) {
        // 文章type类型如下 1 文章 2 会议 3视频 4 精彩回顾
        case '1':
          this.$router.push({
            path: '/articleDetail',
            query: {
              code: this.value.code,
              source: this.source || '12'
            }
          })
          break
        case '2':
          this.$router.push({
            path: '/meetingDetail',
            query: {
              code: this.value.code,
              source: this.source || '12'
            }
          })
          break
        case '3':
          this.$router.push({
            path: '/videoDetail',
            query: {
              code: this.value.code,
              source: this.source || '12'
            }
          })
          break
        case '4':
          this.$router.push({
            path: '/caseDetail',
            query: {
              code: this.value.code,
              source: this.source || '12'
            }
          })
          break
        default:
      }
      // if(this.value.modelCode == "AMYXY-QNYSJ") {
      //   // 青年演说家模块没有type   点击直接跳转选手详情
      //     this.$router.push({
      //       path:'/playerDetail',
      //       query:{
      //         code:this.value.code,
      //         source:'12'
      //       }
      //     })
      // }
    },
    ready () {
      this.areaCode = process.env.VUE_APP_AREA_CODE
      var d = this.value
      d.title = d.title || d.articleTitle || d.videoTitle || d.meetingTitle
      d.type = d.type || this.type || ''
      if (d.firstOnlineTimeUp && d.firstOnlineTimeUp.length > 5) {
        d.firstOnlineTimeUp = util.formatTimes(d.firstOnlineTimeUp, 'MM-dd')
      }

      if (d.appearTime) {
        d.pushTime = d.appearTime.split('-')[0] + '年' + d.appearTime.split('-')[1] + '月'
      }
      d.praiseNum = this.numsFormat(d.praiseNum)
      d.readNum = this.numsFormat(d.readNum)
      // 对标签的处理
      if (d.labelName) {
        if (d.labelName.indexOf('神内') != -1) {
          d.labName = '神内'
        } else if (d.labelName.indexOf('神外') != -1) {
          d.labName = '神外'
        } else if (d.labelName.indexOf('儿科') != -1) {
          d.labName = '儿科'
        } else {
          d.labName = d.labelName.split(',')[0]
        }
      }

      d.showPraise = this.praise// 默认不显示点赞数
      d.showReady = this.read// 默认不显示阅读数
      d.showTime = this.time// 默认不显示时间
      d.showColumn = this.column// 默认不显示栏目
      d.showLiveStatus = this.livestatus// 默认不显示直播状态
      d.issueDay = this.day// 默认不展示发布日期
      d.showPushTime = this.pushtime// 默认不展示文献发表时间
      d.showLab = this.label// 默认不展示文献发表时间
      d.showNb = this.shownb// 诺比在线特殊样式
      d.showTitle = d.title
      // d.broadcastEndTime = util.formatTimes(d.broadcastEndTime, 'yyyy-MM-dd hh:mm');
      if (d.broadcastStatus == 'A') { d.liveStatusName = '直播中' }
      if (d.broadcastStatus == 'B') { d.liveStatusName = '+报名' }
      if (d.broadcastStatus == 'C' || d.broadcastStatus === '') { d.liveStatusName = '已报名' }
      if (d.broadcastStatus == 'D') { d.liveStatusName = '已结束' }
      // if (d.broadcastStatus == 'A') {
      //   d.showTime = false
      // }

      // 计算显示直播时间的展示逻辑

      d.liveTimeName = this.formatDate(d) // "04月22日 12:09";
      // 根据文章不同类型进行渲染 先计算出渲染页面所需数据
      switch (d.type) {
      // 文章type类型如下 1 文章 2 会议 3视频 4 精彩回顾
        case '1':
        // d.showColumn = this.source=='index'?true:false;
        // d.issueDay=this.source == 'jchg' ? true : false;//泰舒达 病例专区-精彩回顾模块样式展示
        // d.showPraise = true;
        // d.showReady = true;
          break
        case '2':

          if (d.broadcastStatus == 'A' || d.broadcastStatus == 'D') { // 直播已开播，显示点赞数
            d.showPraise = true
          }
          // 会议默认展示样式
          if (!this.type) {
            d.showNb = false
            d.showPraise = false// 默认不显示点赞数
            d.showColumn = false// 默认不显示栏目
            d.issueDay = false// 默认不展示发布日期
            d.showLab = false// 默认不展示文献发表时间
            d.showReady = true
            d.showTime = true
            d.showLiveStatus = true
          }

          // d.issueDay = this.source == 'jchg' ? true : false;//泰舒达 病例专区-精彩回顾模块样式展示

          break
        case '3':
        // d.showColumn = this.source == 'index' ? true : false;
        // d.issueDay = this.source == 'jchg' ? true : false;//泰舒达 病例专区-精彩回顾模块样式展示
        // d.showPraise = true;
        // d.showReady = true;
          break
        case '4':
        // d.showColumn = this.source == 'index' ? true : false;
        // d.issueDay = this.source == 'jchg' ? true : false;//泰舒达 病例专区-精彩回顾模块样式展示
        // d.showPraise = true;
        // d.showReady = true;
          break
        default:
      }

      this.dataSource = d
    }
  }
}
</script>

<style lang='less' scoped>
@import 'src1/stylelist-item.less';
</style>
