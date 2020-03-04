<template>
  <div>
    <listItem v-for="(item,index) in list " source='13' :key="index" :value='item' read praise  label/>
    <!-- 底部提示 -->
    <div class="no-more">
      <div class="none" v-show="isLastPage && list.length > 0">我是有底线的~</div>
      <div class="nothing" v-show="loaded && list.length == 0">
        <img src="src1/assets/images/nothing.png" alt="">
        <div class="txt-info">暂无内容</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import listItem from '../../lists/list-item'
import { changeTitle } from '../../../utils/func'
export default {
  components: {
    listItem
  },
  created () {
    changeTitle('我的收藏')
    this.getList()
  },
  mounted () {
    this.hideLoad()
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '我的收藏',
        EventID: '1',
        ControlName: '',
        Description: ''
      })
    } catch (error) {
      console.log(error)
    }
  },

  data () {
    return {
      list: [],
      loaded: false,
      loading: false,
      isLastPage: false,
      pageNum: 1,
      pageSize: 10
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getCollections: 'user/getCollections',
      baoSaveReport: 'ubt/baoSaveReport'
    }),

    load () {
    // 下拉到页面底部   加载更多列表
      window.onscroll = () => {
        const scrollTop = window.pageYOffset || // 用于FF
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0 // 获取页面滚动出去高度
        const clientHeigth = document.documentElement.clientHeight // 获取浏览器窗口的高度
        const scrollHeight = document.documentElement.scrollHeight // 获取页面高度
        if (scrollTop + clientHeigth + 10 >= scrollHeight) { // 当页面页面滚动出去的 高度 + 获取浏览器窗口的高度 > 页面高度
          // 加载列表下一页的内容
          console.log('触底了')
          this.getList()
        }
      }
    },
    async getList () {
      if (this.isLastPage || this.loading) {
        return
      }
      var data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      try {
        this.loading = true
        var res = await this.getCollections(data)
        this.list = this.list.concat(res.data.list)
        this.isLastPage = res.data.isLastPage
        this.pageNum = res.data.nextPage
        this.loading = false
        this.load()
        this.loaded = true
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
