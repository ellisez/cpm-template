<template>
  <div class="item" @click="clickDetail">
    <div class="msg-title">{{ info.fieldName?'【'+info.fieldName + '】'+ info.name:'' + info.name }}</div>
    <div class="nums">
      <div class="fl" v-if=" info.firstOnlineTimeUp ">{{ info.firstOnlineTimeUp }}</div>
      <div class="read fl" v-if=" info.readNum ">{{ info.readNum }}</div>
      <div class="zan fl" v-if=" info.praiseNum ">{{ info.praiseNum }}</div>
    </div>
    <div class="point" v-show="info.status == 0">新</div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    item: {
      type: Object
    }
  },
  created () {
    console.log(this.item)
    var item = this.item
    item.firstOnlineTimeUp = item.firstOnlineTimeUp
      ? item.firstOnlineTimeUp.slice(5, 10)
      : item.createTime.slice(5, 10)
    item.praiseNum = this.numsFormat(item.praiseNum)
    item.readNum = this.numsFormat(item.readNum)
    this.info = item
  },
  data () {
    return {
      info: ''
    }
  },
  methods: {
    ...mapActions({
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
    // 列表页的点击事件
    clickDetail () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-通用列表',
          EventID: '2',
          ControlName: '直播报名',
          Description: this.itemc.code || ''
        })
      } catch (error) {
        console.log(error)
      }
      // 首先判断是否为外链
      if (this.item.linkAddressUrl) {
        location.href = this.item.linkAddressUrl
        return
      }
      switch (this.item.type + '') {
        // 文章type类型如下 1 文章 2 会议 3视频 4 精彩回顾
        case '1':
          this.$router.push({
            path: '/articleDetail',
            query: {
              code: this.item.code,
              shareEncryptKey: this.item.shareEncryptKey,
              source: 17
            }
          })
          break
        case '2':
          this.$router.push({
            path: '/meetingDetail',
            query: {
              code: this.item.code,
              shareEncryptKey: this.item.shareEncryptKey,
              source: 17
            }
          })
          break
        case '3':
          this.$router.push({
            path: '/videoDetail',
            query: {
              code: this.item.code,
              shareEncryptKey: this.item.shareEncryptKey,
              source: 17
            }
          })
          break
        case '4':
          this.$router.push({
            path: '/caseDetail',
            query: {
              code: this.item.code,
              shareEncryptKey: this.item.shareEncryptKey,
              source: 17
            }
          })
          break
        case '7':
          this.$router.push({
            path: '/answerDetail',
            query: {
              code: this.item.code,
              shareEncryptKey: this.item.shareEncryptKey,
              source: 17
            }
          })
          break
        default:
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import url("../../style/msg-list.less");
</style>
