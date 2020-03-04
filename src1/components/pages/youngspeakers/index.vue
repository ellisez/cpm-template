// 百家讲坛集
<template>
<!-- 搜索 -->
  <div class="box">
    <div class='search'>
      <div class='input' @click="toSearch">
        输入关键字搜索
      </div>
    </div>

    <countdown v-if="liveInfo.code" :value='liveInfo' />

    <div class="lists">
      <listItem v-for="(item,index) in list" :key="index" :value='item' read praise label/>
    </div>

    <!-- 底部提示 -->
    <div class="no-more">
      <div class="none" v-show="isLastPage && list.length > 0">我是有底线的~</div>
      <div class="nothing" v-show="loaded && list.length == 0">
        <img src="src1/assets/images/nothing.png" alt="">
        <div class="txt-info">暂无内容</div>
      </div>
    </div>

    <div class="height70"></div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import countdown from '../../common/countdown'
import listItem from '../../lists/list-item'
import { changeTitle } from '../../../utils/func'
import share from '../../../utils/share'
export default {
  components: {
    countdown, listItem
  },
  created () {
    changeTitle('青年演说家')
    this.getList()
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '青年演说家',
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
    share({
      title: '青年演说家',
      desc: '锁定直播同步点评 互动新颖',
      link: `${location.origin}${location.pathname}#/youngspeakers`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
    })
  },
  data () {
    return {

      list: [],
      modelCode: 'AMYXY-QNYSJ',
      pageNum: 1,
      pageSize: 10,
      loading: false,
      isLastPage: false,
      loaded: false,
      liveInfo: {}
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getArticleList: 'content/getCommonList',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    toSearch () {
      this.$router.push({
        path: '/searchArticle',
        query: {
          modelCode: 'AMYXY-QNYSJ'
        }
      })
    },
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
      if (this.loading || this.isLastPage) {
        return
      }
      var data = {
        modelCode: this.modelCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      try {
        this.loading = true
        var res = await this.getArticleList(data)
        this.list = this.list.concat(res.data.list)

        if (this.list[0].broadcastStatus && this.list[0].broadcastStatus != 'D' && this.pageNum == 1) {
          this.liveInfo = this.list[0]
          this.list.shift()
        }
        this.load()
        this.loaded = true
        this.isLastPage = res.data.isLastPage
        this.loading = false
        this.pageNum = res.data.nextPage
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import url('src1/stylengspeaker.less');
.no-more {
  text-align: center;
  font-size: 12px;
  color: #9b9b9b;
  .none {
    line-height: 50px;
  }
  .nothing {
    width: 70%;
    margin: 20px auto;
  }
}
</style>
