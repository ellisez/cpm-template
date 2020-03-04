<template>
  <div class="video-list" @click="jump">
    <div class="img">
      <img :src="value.thumbnailUrl" alt="" onerror='onerror=null;src="https://imageysz.yxj.org.cn/1553495609443.png"'>
      <div class="video-icon" alt=""></div>
    </div>
    <div class="title">{{ value.articleTitle || value.title }}</div>
    <div class="nums">
      <!-- <div class="date">{{ value.createTime }}</div> -->
      <div class="label" v-if="value.labelName">{{ value.labelName.split(',')[0] }}</div>
      <div class="praise">{{ value.readNum | numsFormat }}</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    value: {
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
  methods: {
    ...mapActions({
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    jump () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-视频列表',
          EventID: '2',
          ControlName: '详情跳转',
          Description: this.value.code
        })
      } catch (error) {
        console.log(error)
      }
      if (this.value.type == 3) {
        this.$router.push({
          path: '/videoDetail',
          query: {
            code: this.value.code,
            source: this.source || 12
          }
        })
      } else {
        this.$router.push({
          path: '/meetingDetail',
          query: {
            code: this.value.code,
            source: this.source || 12
          }
        })
      }
    }
  }

}
</script>

<style lang='less' scoped>
@import url('src1/stylevideo-list.less');
</style>
