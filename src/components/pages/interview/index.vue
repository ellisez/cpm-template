// 百家讲坛集
<template>
<!-- 搜索 -->
  <div class="box">
    <div class='search'>
      <div class='input'>
        输入关键字搜索
      </div>
    </div>

    <countdown />

    <div class="lists">
      <videoList/>
      <videoList/>
      <videoList/>
      <videoList/>
      <videoList/>
      <videoList/>
    </div>
    <div class="height70"></div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import countdown from '../../common/countdown'
import videoList from '../../lists/video-list'
export default {
  components: {
    countdown, videoList
  },
  mounted () {
    this.hideLoad()
  },
  methods: {
    ...mapMutations(['hideLoad'])
  }
}
</script>

<style lang='less' scoped>
@import url('../../../style/interview.less');
</style>
