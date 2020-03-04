<template>
  <div class="box">

    <list-item v-for="(item,index) in list" :key="index" :value='item' time  livestatus/>
    <!-- 底部提示 -->
    <div class="no-more">
      <div class="none" v-show="list.length > 0">我是有底线的~</div>
      <div class="nothing" v-show="loaded && list.length == 0">
        <img src="src1/assets/images/nothing.png" alt="">
        <div class="txt-info">暂无内容</div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import listItem from '../../lists/list-item'
import { changeTitle } from '../../../utils/func'
export default {
  components: {
    listItem
  },
  created () {
    this.getList()
    changeTitle('直播报名')
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '直播报名',
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
      getMyMeetingList: 'content/getMyMeetingList',
      baoSaveReport: 'ubt/baoSaveReport'
    }),

    async getList () {
      if (this.loading) {
        return
      }
      var data = {
      }
      try {
        this.loading = true
        var res = await this.getMyMeetingList(data)
        this.list = res.data
        this.loaded = true
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import 'src1/stylentier.less';
</style>
