<template>
  <!-- <div>发布列表</div> -->
  <div class="release" @click="toDetail">
    <div class="top">
      <div class="date">{{ value.createTime.slice(0,10).replace(/-/gi,'.') }}</div>
      <div class="join-num" v-show="value.answerNum > 0">已有{{ value.answerNum }}人参加</div>
      <div class="detail-btn">详情</div>
    </div>
    <div class="info">
      话题：{{ value.question }}
    </div>
    <div class="status-box">
      <div class="status" :class="{'checking':value.auditStatus == 'A','fail':value.auditStatus == 'C'}">{{ value.auditStatus== 'A'?'审核中':value.auditStatus=='C'?'未通过':'已通过' }}</div>
      <!-- <div class="msg">1条新动态</div> -->
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    value: {
      type: Object
    }
  },
  methods: {
    ...mapActions({
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    // 详情跳转
    toDetail () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-我的同期声列表',
          EventID: '2',
          ControlName: '详情跳转',
          Description: this.value.code || ''
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/answerDetail',
        query: {
          code: this.value.code,
          source: 12
        }
      })
    }
  }

}
</script>
<style lang="less" scoped>
  @import url('src1/stylerelease.less');
</style>
<style>

</style>
