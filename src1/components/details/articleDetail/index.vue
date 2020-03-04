<template>
  <div class="box">
    <!--会议详情-->
<div class='detail'>

  <div class='title-box'>

    <div class='title'>{{content.articleTitle}}</div>

    <div class='read-num'>{{content.firstOnlineTimeUp}}</div>

  </div>

  <div class='summary' v-if='  content.summary '>
    <span>摘要：</span>{{content.summary}}
  </div>

  <div class="video-player" v-show="content.videoUrl">
    <videoComp ref="video" :item='content'/>
  </div>

  <div class='content'>

    <!-- <htmltowxml text='content.content' /> -->
    <div v-html="content.content"></div>
    <!-- <template is="wxParse" data='wxParseData:content.nodes'/> -->
    <div class='nums'>

      <div class='read' v-if='content.readNum'>阅读量：{{content.readNum}}</div>
      <div class='zan' v-if=' content.praiseNum '>点赞量：{{content.praiseNum}}</div>
    </div>
  </div>

  <div class='line'  v-show='showTopic'></div>

  <div class='tab big'  v-show='showTopic'>
    答题小提示
    <img class='answer' src='http://studioimage.yxj.org.cn/1545284109837.png' mode='widthFix'/>
  </div>
  <!-- 传入整个详情页数据 -->
  <qa ref="qa" @triggerEvent='triggerEvent'  :code='content.code' v-show='content.code&&showTopic'/>

  <div class='tab' v-if="content.code && content.recommendList.length > 0 " v-show="$route.meta.backIndex">
    相关推荐
    <img class='recommend' src='http://studioimage.yxj.org.cn/1545284019950.png'/>
  </div>
  <!-- 传入循环的item -->
  <div class='recommend-title' v-show="$route.meta.backIndex" v-for='(item,index) in content.recommendList' :key="index">
    <list-item :value='item' :type='content.type' source='14' read praise day/>
  </div>

  <div class='line' v-if="messageList.length > 0" v-show="$route.meta.backIndex"></div>
  <div class='tab' v-if="messageList.length > 0" v-show="$route.meta.backIndex">
    精彩评论
    <img class='comment' src='http://studioimage.yxj.org.cn/1545284008839.png' mode='widthFix'/>
  </div>

  <!-- 传入循环的item -->
  <div class="comment-list" v-if="messageList.length > 0"  v-show="$route.meta.backIndex">
    <comments v-for='(item,index) in messageList' :key="index" :item='item'/>
    <div class="last" v-show="isLastPage">我是有底线的~</div>
  </div>

</div>
<comment  v-show="$route.meta.backIndex" :code='content.code' :isVote='content.isVote' :items='content' :isCollect='content.isCollect' @myevent="onMyEvent"/>

  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import qa from '../../common/detail-qa'
import comment from '../../common/comment'
import videoComp from '../../common/video'
import listItem from '../../lists/list-item'
import comments from '../../lists/comments'
import share from '../../../utils/share'
import { Toast } from 'vant'
import { changeTitle } from '../../../utils/func'
export default {
  components: {
    qa, listItem, comments, comment, videoComp
  },
  created () {
    // 获取文章详情
    this.getArticleDetail()
  },
  mounted () {
    this.hideLoad()
  },
  data () {
    return {
      content: {},
      messageList: [],
      pageNum: 1,
      pageSize: 10,
      isLastPage: false,
      loading: false,
      playTimer: '',
      stayTimer: '',
      scrollTop: 0,
      showTop: false,
      topTimer: '',
      reportTimer: '',
      showTopic: false,
      code: '', // 文章code
      showEmail: false,
      showBackIndex: true
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getArticle: 'content/getArticle',
      reportJfUp: 'content/reportJfUp',
      getComments: 'content/getComments',
      reportUserTime: 'content/reportUserTime',
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
          this.getMsgList()
        }
      }
    },
    // 点赞回传
    onMyEvent (e) {
      this.content.praiseNum += e.praiseNum
      this.content.isVote += e.praiseNum
    },
    // 获取评论列表
    async getMsgList () {
      if (this.isLastPage || this.loading) {
        return
      }
      var data = {
        code: this.$route.query.code,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }

      this.loading = true
      var res = await this.getComments(data)
      console.log('res', res)
      this.messageList = this.messageList.concat(res.data.list)
      this.isLastPage = res.data.isLastPage
      this.pageNum = res.data.nextPage
      this.loading = false
    },
    // qa组件传值
    triggerEvent (e) {
      this.showTopic = e != 0
    },
    // 上报时长
    reportTime (logType) {
      try {
        var data = {
          code: this.content.code,
          type: this.content.type,
          viewId: this.content.viewId,
          logType: logType + ''
        }
        this.reportUserTime(data)
      } catch (err) {
        console.log(err)
      }
    },
    // 获取详情数据
    async getArticleDetail () {
      try {
        var res = await this.getArticle(this.$route.query)
        if (this.stayTimer) {
          clearInterval(this.stayTimer)
        }

        this.stayTimer = setInterval(() => {
          this.reportTime(1)
        }, 5000)
        var that = this
        this.content = res.data
        changeTitle(this.content.articleTitle)
        share({
          title: this.content.articleTitle,
          desc: this.content.summary || '',
          link: `${location.origin}${location.pathname}#/articleDetail?shareEncryptKey=${this.content.shareEncryptKey}&id=${this.content.id}&code=${this.content.code}&source=16`,
          imgUrl: this.content.thumbnailUrl.indexOf('/art-minpic-none.png') == -1 ? this.content.thumbnailUrl : 'https://imageysz.yxj.org.cn/1554191431121.jpg',
          shareEncryptKey: this.content.shareEncryptKey,
          type: this.content.type
        })
        // 触底加载事件绑定
        this.load()
        // 获取评论列表
        this.getMsgList()
        // 触发子组件中的方法获取数据
        this.$refs.qa.getInfo()
        this.$refs.video.init()
        var timer1 = setTimeout(() => {
          // 页面停留加积分
          var data = {
            code: this.content.code,
            type: '1'
          }
          this.reportJfUp(data)
            .then(res => {
              if (res.data.score > 0) {
                Toast('积分+' + res.data.score)
              }
            })
        }, 5000)
        this.reportStayTimer = timer1
      } catch (err) {
        console.log(err)
      }
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '文章详情',
          EventID: '1',
          ControlName: '',
          Description: location.href
        })
      } catch (error) {
        console.log(error)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    if (from.name == 'challenge') {
      to.meta.backIndex = false
    } else {
      to.meta.backIndex = true
    }
    next()
  },
  beforeDestroy () {
    clearInterval(this.stayTimer)
    clearTimeout(this.reportStayTimer)
  },
  watch: {
    $route () {
      clearInterval(this.stayTimer)
      clearTimeout(this.reportStayTimer)
      this.content = {}
      this.messageList = []
      this.pageNum = 1
      this.isLastPage = false
      this.loading = false
      this.getArticleDetail()
    }
  }
}
</script>

<style lang='less' scoped>
@import 'src1/styleicledetail.less';
</style>
