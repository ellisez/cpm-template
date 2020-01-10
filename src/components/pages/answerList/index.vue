<template>
  <div class="box">
    <div class='search'>
      <div class='input' @click="toSearch">
        输入关键字搜索
      </div>
    </div>
    <div class="lists">
      <question v-for="(item,index) in list" :key="index" :value='item' :player='player' :voiceUrl='voiceUrl' @setUrl='setUrl'/>
    </div>

    <!-- 底部提示 -->
    <div class="no-more">
      <div class="none" v-show="isLastPage && list.length > 0">我是有底线的~</div>
      <div class="nothing" v-show="loaded && list.length == 0">
        <img src="../../../assets/images/nothing.png" alt="">
        <div class="txt-info">暂无内容</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import question from '../../lists/question'
import { changeTitle } from '../../../utils/func'
import share from '../../../utils/share'
export default {
  components: {
    question
  },
  created () {
    changeTitle('学术同期声')
    this.player = new Audio()
    this.player.addEventListener('play', () => {
      console.log('录音播放', this.player)
      if (this.report_listen_timer) {
        clearInterval(this.report_listen_timer)
      }
      // 设置定时器上报时长
      this.report_listen_timer = setInterval(() => {
        let data = {
          type: this.voiceUrl.type,
          code: this.voiceUrl.code,
          logType: '2',
          viewId: ''
        }
        this.reportUserTime(data).then(res => {
          console.log(res)
        })
      }, 5000)
      // this.playing = false
    })
    this.player.addEventListener('pause', () => {
      console.log('录音暂停', this.player)
      clearInterval(this.report_listen_timer)
      // this.playing = false
    })
    this.player.addEventListener('timeupdate', () => {
      // console.log('录音播放中',this.player.src)
      // this.playing = false
    })
    this.player.addEventListener('ended', () => {
      console.log('录音播放结束', this.player.src)
      this.voiceUrl = {}
      // this.playing = false
    })
    this.getList()
  },
  mounted () {
    this.hideLoad()
    share({
      title: '学术同期声',
      desc: '有问题发语音答疑解惑专家行',
      link: `${location.origin}${location.pathname}#/answerList?screenType=${this.$route.query.screenType}`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
    })
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '待解答 || 已解答',
        EventID: '1',
        ControlName: '',
        Description: '列表页'
      })
    } catch (error) {
      console.log(error)
    }
  },
  data () {
    return {
      list: [],
      isLastPage: false,
      loading: false,
      loaded: false,
      pageNum: 1,
      pageSize: 10,
      player: {},
      voiceUrl: {},
      report_listen_timer: ''
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      queryYnAskList: 'content/queryYnAskList',
      reportUserTime: 'content/reportUserTime',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    toSearch () {
      try {
      // 埋点
        this.baoSaveReport({
          PageName: '待解答 || 已解答',
          EventID: '2',
          ControlName: '关键字搜索',
          Description: '进入搜索页'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/searchQuestion',
        query: {
          modelCode: 'AMYXY-XSTQS',
          screenType: this.$route.query.screenType

        }
      })
    },
    setUrl (url) {
      this.voiceUrl = url
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
      if (this.isLastPage || this.loading) {
        return
      }
      var data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        screenType: this.$route.query.screenType
      }
      try {
        this.loading = true
        var res = await this.queryYnAskList(data)
        this.list = this.list.concat(res.data.list)
        this.isLastPage = res.data.isLastPage
        this.pageNum = res.data.nextPage
        this.loaded = true
        this.loading = false
        this.load()
      } catch (error) {
        console.log(error)
      }
    }
  },
  watch: {
    $route () {
      this.player.pause()
      this.voiceUrl = ''
      window.onscroll = null
    }
  }
}
</script>
<style lang="less" scoped>
  @import url('../../../style/answerList.less');
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
<style>

</style>
