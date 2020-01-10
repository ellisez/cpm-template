<template>
  <div class="msg-box">
    <msgList v-for="(item,index) in list" :key="index" :item='item'/>

    <!-- 底部提示 -->
    <div class="no-more">
      <div class="none" v-show="list.length > 0">我是有底线的~</div>
      <div class="nothing" v-show="loaded && list.length == 0">
        <img src="../../../assets/images/nothing.png" alt="">
        <div class="txt-info">暂无内容</div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapActions, mapMutations } from 'vuex'
import msgList from '../../lists/msg-list'
import { changeTitle } from '../../../utils/func'
export default {
  components: {
    msgList
  },
  created () {
    changeTitle('消息通知')
    this.getList()
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '消息通知',
        EventID: '1',
        ControlName: '',
        Description: ''
      })
    } catch (error) {
      console.log(error)
    }
  },
  mounted () {
    this.hideLoad()
  },

  data () {
    return {
      list: [],
      loaded: false

    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getNewsList: 'user/getNewsList',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    async getList () {
      try {
        var res = await this.getNewsList({})
        this.list = res.data
        this.loaded = true
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang='less' scoped>
.msg-box {
  background-color: #fff;
}
</style>
