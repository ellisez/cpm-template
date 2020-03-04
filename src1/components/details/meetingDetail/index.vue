<template>
  <div>
    <!--会议详情-->
    <div class="detail">
      <img
        v-if="content.code && content.topImgUrl.indexOf('art-minpic-none.png') == -1"
        :src="content.topImgUrl"
        mode="widthFix"
      />

      <div class="title-box">
        <div class="title">{{ content.meetingTitle }}</div>
        <div class="read-num">观看人数： {{ content.readNum }}人</div>
      </div>
      <div class="enter-btns" ref="enter-btns">
        <div class="btns-meeting">
          <div
            class="to enter_live"
            @click="to(content.broadcastUrl)"
            v-if="content.broadcastUrl && showLive "
          >
            <img src="src1/assets/icon/zhibo.png" />
            <span>进入直播</span>
          </div>
        </div>
      </div>
      <div class="video-player" v-show="content.videoUrl">
        <videoComp ref="video" :item="content" />
      </div>

      <!-- <div class='tab'>
        会议时间
        <img class='time' src='http://studioimage.yxj.org.cn/1545284070329.png' mode='widthFix'/>
      </div>

      <div class='meeting-date'>{{ content.meetingStartDate }} - {{ content.meetingEndDate }}</div>-->

      <div class="tab" v-if=" content.meetingAddress " style="margin-top:-20px">
        会议地址
        <img
          class="addra"
          src="http://studioimage.yxj.org.cn/1545283909855.png"
          mode="widthFix"
        />
      </div>
      <div class="addr-info" v-if=" content.meetingAddress ">{{ content.meetingAddress }}</div>

      <div class="tab">
        专家介绍
        <img class="addra" src="http://studioimage.yxj.org.cn/1545283757919.png" />
      </div>
      <div class="addr">
        <div class="doc-info-box">
          <div class="introduce">
            <div class="content" v-html="content.expertIntroduce"></div>
          </div>
        </div>
      </div>

      <div class="tab">
        会议介绍
        <img
          class="introduce"
          src="http://studioimage.yxj.org.cn/1545283962205.png"
          mode="widthFix"
        />
      </div>

      <div class="meeting-introduce">
        <div class="content" v-html="content.meetingIntroduce"></div>
      </div>

      <div class="tab" v-if=" content.meetingSchedule ">
        会议日程
        <img
          class="program"
          src="http://studioimage.yxj.org.cn/1545284046367.png"
          mode="widthFix"
        />
      </div>

      <div class="meeting-introduce" v-if=" content.meetingSchedule ">
        <div class="content" v-html="content.meetingSchedule"></div>
      </div>

      <div class="tab big" v-show="showTopic ">
        答题小提示
        <img
          class="answer"
          src="http://studioimage.yxj.org.cn/1545284109837.png"
          mode="widthFix"
        />
      </div>
      <!-- 传入整个详情页数据 -->
      <qa ref="qa" :code=" content.code " @triggerEvent="triggerEvent" v-show=" showTopic " />

      <div class="tab" v-if="content.recommendList && content.recommendList.length != 0">
        相关推荐
        <img
          class="recommend"
          src="http://studioimage.yxj.org.cn/1545284019950.png"
          mode="widthFix"
        />
      </div>
      <!-- 传入循环的item -->
      <div class="recommend-title">
        <listItem
          type="2"
          v-for="(item,index) in content.recommendList"
          source="14"
          :key="index"
          :value="item"
          read
          praise
          day
        />
      </div>

      <div class="line" v-if=" messageList.length != 0 "></div>
      <div class="tab" v-if=" messageList.length != 0 ">
        精彩评论
        <img
          class="comment"
          src="http://studioimage.yxj.org.cn/1545284008839.png"
          mode="widthFix"
        />
      </div>

      <!-- 传入循环的item -->
      <comments v-for="(item,index) in messageList " :item=" item " :key="index" />
      <div class="no-more" v-show="isLastPage && messageList.length > 0 ">我是有底线的~</div>
    </div>

    <div
      class="enter_survey"
      @click="survey(content.surveyUrl)"
      v-if="content.surveyUrl && showLive "
    >
      <img src="src1/assets/images/enter-survey.png" />
    </div>

    <comment
      v-if="content"
      :code="content.code"
      type="meetingDetail"
      :items="content"
      @myevent="onMyEvent"
    />

    <transition name="fade" v-if="content.broadcastUrl && showLive ">
      <div class="isRowZhiboShow" v-if="isRowZhiboShowDom" @click="to(content.broadcastUrl)">
        <div class="isRowZhiboShow_con">
          <img src="src1/assets/icon/zhibo.png" />
          <div>进入直播</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import qa from '../../common/detail-qa'
import comment from '../../common/comment'
import videoComp from '../../common/video'
import listItem from '../../lists/list-item'
import comments from '../../lists/comments'
import { Toast, Dialog } from 'vant'
import share from '../../../utils/share'
import storage from 'storejs'
import { changeTitle } from '../../../utils/func'
import { constants } from 'fs'
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
    let that = this
    window.addEventListener('scroll', that.isRowZhiboShow, false)
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
      showTopic: false,
      showLive: false,
      isRowZhiboShowDom: false // 直播是否出来 横着的
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getMeetingInfo: 'content/getMeetingInfo',
      reportJfUp: 'content/reportJfUp',
      getComments: 'content/getComments',
      reportUserTime: 'content/reportUserTime',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    /**
     * 直播是否出来 横着的
     */
    isRowZhiboShow (e) {
      const qyfyTop = document.querySelector('.enter-btns')
      const bTop = qyfyTop.getBoundingClientRect().top
      let offsetHeig = qyfyTop.offsetHeight
      this.isRowZhiboShowDom = bTop < -offsetHeig
    },
    // 进入直播
    to (broadcastUrl) {
      if (
        !storage.get(process.env.VUE_APP_STORAGE_NAME) ||
        (storage.get(process.env.VUE_APP_STORAGE_NAME) &&
          !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt)
      ) {
        Dialog.confirm({
          title: '提示',
          message: '未登录无法进行此操作！',
          confirmButtonText: '去登录',
          cancelButtonText: '再看看',
          showCancelButton: true
        })
          .then(() => {
            // on confirm
            this.$router.push({
              path: '/login'
            })
          })
          .catch(() => {
            // on cancel
          })
        return
      }
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '会议详情',
          EventID: '2',
          ControlName: '进入直播',
          Description: broadcastUrl
        })
      } catch (error) {
        console.log(error)
      }

      if (
        broadcastUrl.indexOf('yaotongyun.com/meeting/#/meeting') > 0 ||
        broadcastUrl.indexOf('/yty/#/meeting') > 0 ||
        broadcastUrl.indexOf('yaotongyun.com/cloud/') > 0
      ) {
        if (broadcastUrl.indexOf('?') > 0) {
          location.href =
            broadcastUrl +
            '&userid=' +
            storage.get(process.env.VUE_APP_STORAGE_NAME).userId +
            '&companyCode=' +
            process.env.VUE_APP_COMPANY_CODE
        } else {
          location.href =
            broadcastUrl +
            '?userid=' +
            storage.get(process.env.VUE_APP_STORAGE_NAME).userId +
            '&companyCode=' +
            process.env.VUE_APP_COMPANY_CODE
        }

        return
      }

      location.href = broadcastUrl
    },
    // 会议调研
    async survey () {
      var code = this.content.surveyUrl.split('?code=')[1]
      try {
        var data = {
          code
        }
        var res = await serviceAPI.checkSurvey(data)
        console.log(res)
        if (res.data.isFlag == 1) {
          Dialog.alert({
            title: '提示',
            message: '你已参与过此调研'
          })
        } else {
          try {
            // 埋点
            this.baoSaveReport({
              PageName: '会议详情',
              EventID: '2',
              ControlName: '参与调研',
              Description: 'code' + code
            })
          } catch (error) {
            console.log(error)
          }

          this.$router.push({
            path: '/survey',
            query: {
              code
            }
          })
        }
      } catch (err) {
        console.log(err)
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
      console.log(res)
      if (res) {
        this.messageList = this.messageList.concat(res.data.list)
        this.isLastPage = res.data.isLastPage
        this.pageNum = res.data.nextPage
      }
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
        var res = await this.getMeetingInfo(this.$route.query)
        if (this.stayTimer) {
          clearInterval(this.stayTimer)
        }

        this.stayTimer = setInterval(() => {
          this.reportTime(1)
        }, 5000)
        var that = this
        this.content = res.data
        changeTitle(this.content.meetingTitle)
        // 触底加载事件绑定
        this.load()
        // 获取评论列表
        this.getMsgList()
        // 触发子组件中的方法获取数据
        console.log(this.$refs)

        share({
          title: this.content.title || this.content.meetingTitle,
          desc: this.content.summary || '',
          link: `${location.origin}${location.pathname}#/meetingDetail?shareEncryptKey=${this.content.shareEncryptKey}&id=${this.content.id}&code=${this.content.code}&source=16`,
          imgUrl:
            this.content.thumbnailUrl.indexOf('/art-minpic-none.png') == -1
              ? this.content.thumbnailUrl
              : 'https://imageysz.yxj.org.cn/1554191431121.jpg',
          shareEncryptKey: this.content.shareEncryptKey,
          type: this.content.type
        })
        this.$refs.qa.getInfo()
        this.$refs.video.init()

        var end = new Date(this.content.broadcastEndTime.replace(/-/g, '/'))
        var now = new Date()
        if (end - now > 0) {
          this.showLive = true
        }
        var timer1 = setTimeout(() => {
          // 页面停留加积分
          var data = {
            code: this.content.code,
            type: '1'
          }
          this.reportJfUp(data).then(res => {
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
          PageName: '会议详情',
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
  },
  destroyed () {
    let that = this
    window.removeEventListener('scroll', that.isRowZhiboShow)
  }
}
</script>

<style lang="less" scoped>
@import url("src1/styletingDetail.less");
</style>
<style>
</style>
