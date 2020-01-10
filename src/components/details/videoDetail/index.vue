<template>
  <div class="box">
    <!--会议详情-->
    <div class="detail">
      <div class="title-box">
        <div class="title">{{content.videoTitle}}</div>

        <div class="read-num">{{content.firstOnlineTimeUp}}</div>
      </div>

      <div class="summary" v-if="content.summary">
        <span>摘要：</span>
        {{content.summary}}
      </div>

      <div class="video-player" v-show="content.videoUrl">
        <videoComp ref="video" :item="content"/>
      </div>

      <div class="content">
        <div class="tab">
          专家介绍
          <img class="addra" src="http://studioimage.yxj.org.cn/1545283757919.png">
        </div>
        <div class="addr">
          <div class="doc-info-box">
            <div
              class="info"
              v-if=" content.expertName || content.expertPosition || content.expertHospital "
            >
              <div class="headimg">
                <img :src="content.expertHeadUrl">
              </div>

              <div class="right">
                <div class="oh">
                  <div class="name fl">{{ content.expertName }}</div>
                  <div class="name fl">{{ content.expertPosition }}</div>
                </div>
                <div class>{{ content.expertHospital }}</div>
              </div>
            </div>

            <div class="introduce" v-html="formatSolution(content.expertIntroduce)"></div>
          </div>
        </div>

        <div class="tab" v-if=" content.courseIntroduce ">
          课程介绍
          <img class="introduce" src="http://studioimage.yxj.org.cn/1545283962205.png">
        </div>

        <div class="meeting-introduce">{{ content.courseIntroduce}}</div>

        <div class="nums">
          <div class="read" v-if="content.readNum">阅读量：{{content.readNum}}</div>
          <div class="zan" v-if=" content.praiseNum ">点赞量：{{content.praiseNum}}</div>
        </div>
      </div>

      <div class="line" v-show="showTopic"></div>

      <div class="tab big" v-show="showTopic">
        答题小提示
        <img
          class="answer"
          src="http://studioimage.yxj.org.cn/1545284109837.png"
          mode="widthFix"
        >
      </div>
      <!-- 传入整个详情页数据 -->
      <qa
        ref="qa"
        @triggerEvent="triggerEvent"
        :code="content.code"
        v-show="content.code&&showTopic"
      />

      <div class="tab" v-if="content.code && content.recommendList.length > 0">
        相关推荐
        <img class="recommend" src="http://studioimage.yxj.org.cn/1545284019950.png">
      </div>
      <!-- 传入循环的item -->
      <div class="recommend-title" v-for="(item,index) in content.recommendList" :key="index">
        <list-item :value="item" :type="content.type" source="14" read praise day/>
      </div>

      <div class="line" v-if="messageList.length > 0"></div>
      <div class="tab" v-if="messageList.length > 0">
        精彩评论
        <img
          class="comment"
          src="http://studioimage.yxj.org.cn/1545284008839.png"
          mode="widthFix"
        >
      </div>

      <!-- 传入循环的item -->
      <div class="comment-list" v-if="messageList.length > 0">
        <comments v-for="(item,index) in messageList" :key="index" :item="item"/>
        <div class="last" v-show="isLastPage">我是有底线的~</div>
      </div>
    </div>
    <comment
      :code="content.code"
      :isVote="content.isVote"
      :items="content"
      :isCollect="content.isCollect"
      @myevent="onMyEvent"
    />
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
    qa,
    listItem,
    comments,
    comment,
    videoComp
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
      reportTimer: '',
      showTopic: false
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getVideoInfo: 'content/getVideoInfo',
      reportJfUp: 'content/reportJfUp',
      getComments: 'content/getComments',
      reportUserTime: 'content/reportUserTime',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    formatSolution (s) {
      if (s) {
        s = s.replace(/[\r\n]/g, '<br />')
        return s
      } else {
        return ''
      }
    },
    load () {
      // 下拉到页面底部   加载更多列表
      window.onscroll = () => {
        const scrollTop =
          window.pageYOffset || // 用于FF
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0 // 获取页面滚动出去高度
        const clientHeigth = document.documentElement.clientHeight // 获取浏览器窗口的高度
        const scrollHeight = document.documentElement.scrollHeight // 获取页面高度
        if (scrollTop + clientHeigth + 10 >= scrollHeight) {
          // 当页面页面滚动出去的 高度 + 获取浏览器窗口的高度 > 页面高度
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
        var res = await this.getVideoInfo(this.$route.query)
        if (this.stayTimer) {
          clearInterval(this.stayTimer)
        }

        this.stayTimer = setInterval(() => {
          this.reportTime(1)
        }, 5000)
        var that = this
        this.content = res.data
        changeTitle(this.content.videoTitle)
        // 触底加载事件绑定
        this.load()
        // 获取评论列表
        this.getMsgList()

        share({
          title: this.content.videoTitle,
          desc: this.content.summary || '',
          link: `${location.origin}${
            location.pathname
          }#/videoDetail?shareEncryptKey=${this.content.shareEncryptKey}&id=${
            this.content.id
          }&code=${this.content.code}&source=16`,
          imgUrl:
            this.content.thumbnailUrl.indexOf('/art-minpic-none.png') == -1
              ? this.content.thumbnailUrl
              : 'https://imageysz.yxj.org.cn/1554191431121.jpg',
          shareEncryptKey: this.content.shareEncryptKey,
          type: this.content.type
        })
        // 触发子组件中的方法获取数据
        this.$refs.qa.getInfo()
        this.$refs.video.init(this.content)
      } catch (err) {
        console.log(err)
      }
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '视频详情',
          EventID: '1',
          ControlName: '',
          Description: location.href
        })
      } catch (error) {
        console.log(error)
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.stayTimer)
  },
  watch: {
    $route () {
      clearInterval(this.stayTimer)
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
@import "../../../style/videodetail.less";
</style>
