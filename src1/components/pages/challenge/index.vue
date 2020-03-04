<template>
  <div class="box">
    <div
      class="question-box"
      :class="{'active':false}"
      v-for="(item,index) in topic"
      :key="index"
      v-show="tabIndex == index"
    >
      <div
        class="ques-name"
      >{{ index + 1 }}、{{ item.ques }}（{{ item.type == 0?"单选":item.type == 1?"多选":"简答" }}）</div>
      <div class="answer-box" v-show="item.type != 2">
        <div
          class="answer"
          @click="select({index1:index,index2:i})"
          v-for="(e,i) in item.answerList"
          :key="i"
          :class="{
          'right':e.isAnswer &&answered,
          'wrong':!e.isAnswer && e.selected && answered,
          'selected':e.selected && !answered
        }"
        >{{ e.answer }}</div>
      </div>
      <div class="answer-box input" v-show="item.type == 2">
        <div>答：</div>
        <div class="input-box">
          <textarea v-model="item.answer" placeholder="请输入您的答案,至少200字！"></textarea>
        </div>
      </div>

      <div
        class="commit"
        v-show="!(answered && (index == (topic.length - 1)))"
        :class="{'active':!(item.canNext || item.answer) || !canNext}"
        @click="next(item,index)"
      >{{ time > 0?'提交' + time :answered?'下一题':'提交' }}</div>

      <div
        class="commit"
        :class="{'active':true}"
        v-show="answered && (index == (topic.length - 1))"
      >已完成</div>
    </div>

    <div class="tab">
      参考文献
      <img v-show="!canAnswer" src="src1/assets/images/hand.png" class="hand" alt>
    </div>

    <div class="list-item" @click="toDetail">
      <div class="img">
        <img :src="article.thumbnailUrl" alt>
      </div>
      <div class="item-info">
        <div class="title">{{ article.articleTitle }}</div>
        <div class="nums">
          <div class="read">{{ article.readNum }}</div>
          <div class="praise">{{ article.praiseNum }}</div>
          <div
            class="date"
            v-if="article.firstOnlineTimeUp"
          >{{ article.firstOnlineTimeUp.slice(5,10) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { Toast, Dialog } from 'vant'
import { changeTitle } from '../../../utils/func'
import share from '../../../utils/share'

export default {
  created () {
    changeTitle('达人挑战')
    this.getTopic()
    this.getInfo()
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '达人挑战详情页',
        EventID: '1',
        ControlName: '',
        Description: location.href
      })
    } catch (error) {
      console.log(error)
    }
  },
  activated () {
    this.getInfo()
  },
  mounted () {
    this.hideLoad()
    share({
      title: '心时讯汇编',
      desc: '闯关答题解文献跃然榜首是达人',
      link: `${location.origin}${location.pathname}#/newsletter`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
    })
  },
  data () {
    return {
      topic: [],
      answered: false,
      canNext: true,
      canAnswer: false,
      article: {},
      tabIndex: 0,
      time: 0,
      start: '',
      answerover: false
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getCustomsInfo: 'content/getCustomsInfo',
      getArticle: 'content/getArticle',
      answerCustomsTopic: 'content/answerCustomsTopic',
      getAccTime: 'content/getAccTime',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    // 获取用户观看时间
    async getTime () {
      var data = {
        code: this.article.code
      }
      try {
        var res = await this.getAccTime(data)
        console.log(res)
        if (res.data >= 10) {
          this.canAnswer = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 点击提交
    next (item, index) {
      if (!this.canAnswer) {
        Dialog.confirm({
          title: '请先阅读文献',
          message: '查看文献(大于10秒)，可以寻找到问题答案哦',
          confirmButtonText: '知道了',
          showCancelButton: false
        })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
          })
        return
      }
      if (!this.canNext) {
        // 当前不能点击
        return
      }
      if (!item.canNext && !item.answer) {
        Toast('请选择或输入答案')
        return
      }
      if (!item.canNext && item.answer.length < 200) {
        Toast('简答题字数必须大于200字')
        return
      }
      if (!item.canNext && item.answer.length > 1000) {
        Toast('简答题字数不得大于1000字')
        return
      }

      this.topic[index].duration = new Date() - this.start
      if (index == this.topic.length - 1) {
        // 最后一题
        this.commit()
        return
      }
      if (!this.answered) {
        // 没答过的需要校验
        var isWrong = item.answerList.find(ele => {
          return (
            (ele.selected && !ele.isAnswer) || (!ele.selected && ele.isAnswer)
          )
        })
        this.answered = true
        if (isWrong) {
          console.log('答错了')
          this.canNext = true
        } else {
          this.canNext = false
          this.time = 3
          var timer = setInterval(() => {
            this.time--
            if (this.time == 0) {
              clearInterval(timer)
              this.answered = false
              this.tabIndex += 1
              this.canNext = true
              this.start = new Date()
            }
          }, 1000)
          console.log('答对了')
        }
      } else {
        this.answered = false
        this.tabIndex += 1
        this.canNext = true
        this.start = new Date()
      }
    },
    // 提交
    async commit () {
      if (this.answered) {
        return
      }
      var list = this.topic
      var answerList = []
      list.forEach(ele => {
        console.log(ele)
        if (ele.type == 2) {
          var obj = {
            topicCode: ele.code,
            answer: ele.answer,
            duration: ele.duration
          }
        } else {
          var arr = []
          ele.answerList.forEach(ele => {
            if (ele.selected) {
              arr.push(ele.answer.slice(0, 1))
            }
          })
          var obj = {
            topicCode: ele.code,
            answer: arr.join('||'),
            duration: ele.duration
          }
        }
        if (!obj.answer) {
          wx.showModal({
            title: '提示',
            content: '请完成答题后提交'
          })
          return
        }
        answerList.push(obj)
      })
      var data = {
        code: this.$route.query.code,
        list: answerList
      }
      console.log(JSON.stringify(data))
      try {
        var res = await this.answerCustomsTopic(data)
        console.log(res)

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
        // this.answered = true
        if (res.data.score > 0) {
          Toast('闯关成功！\n积分' + res.data.score)
        }
        this.answerover = true
        console.log(123456)
        this.$router.push({
          path: '/newsletter'
        })
      } catch (err) {
        console.log(err)
        Toast(err)
      }
    },
    // 答案选择
    select (e) {
      if (this.answered) {
        return
      }
      var indexs = e
      var list = this.topic
      console.log(list[indexs.index1].answerList[indexs.index2])
      console.log(this.topic)
      if (list[indexs.index1].type == 1) {
        // 多选
        list[indexs.index1].answerList[indexs.index2].selected = !list[
          indexs.index1
        ].answerList[indexs.index2].selected
      } else {
        // 单选
        list[indexs.index1].answerList.forEach(ele => {
          ele.selected = false
        })
        list[indexs.index1].answerList[indexs.index2].selected = !list[
          indexs.index1
        ].answerList[indexs.index2].selected
      }
      list[indexs.index1].canNext = true
      this.topic = list
    },
    // 跳转文献详情
    toDetail () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '达人挑战详情页',
          EventID: '2',
          ControlName: '进入文献',
          Description: location.href
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/articleDetail',
        query: {
          code: this.article.code,
          source: ''
        }
      })
    },
    // 获取题目
    async getTopic () {
      var data = this.$route.query
      try {
        var res = await this.getCustomsInfo(data)
        console.log(res)
        var list = res.data
        this.start = new Date()
        var topic = []
        list.forEach((ele, index) => {
          var itemCodes = ele.itemCodes.split('||')
          var itemNames = ele.itemNames.split('||')
          var answerList = []
          itemCodes.forEach((e, i) => {
            answerList.push({
              answer: e + '.' + itemNames[i],
              isAnswer: ele.answer.indexOf(e) != -1,
              selected: ele.previousAnswer.indexOf(e) >= 0
            })
          })
          var obj = {
            ques: ele.topicName, // 问题名字
            type: ele.topicType, //  题型【0：单选，1：多选】
            answerList: answerList,
            code: ele.topicCode
          }
          topic.push(obj)
        })
        console.log(topic)
        this.isTopicFlag = res.data.isTopicFlag
        this.topic = topic
      } catch (error) {
        console.log(error)
      }
    },
    // 获取文献详情
    async getInfo () {
      var data = {
        code: this.$route.query.url
      }
      try {
        var res = await this.getArticle(data)
        this.article = res.data
        console.log(res)
        this.getTime()
      } catch (error) {
        console.log(error)
      }
    }
  },
  // 如果从文章详情进来，保存页面状态，否则不保存（刷新数据）
  beforeRouteEnter (to, from, next) {
    if (from.name == 'articleDetail') {
      to.meta.keepAlive = true
    } else {
      to.meta.keepAlive = false
    }
    next()
  },
  // 去文章详情，保存页面状态，否则不保存（刷新数据）
  beforeRouteLeave (to, from, next) {
    if (to.name == 'articleDetail') {
      from.meta.keepAlive = true
      next()
    } else {
      from.meta.keepAlive = false
      console.log(123)
      if (!this.answerover) {
        Dialog.confirm({
          title: '提示',
          message: '答题未完成，是否放弃挑战',
          confirmButtonText: '是',
          cancelButtonText: '否',
          showCancelButton: true
        })
          .then(() => {
            // on confirm
            next()
          })
          .catch(() => {
            // on cancel
          })
      } else {
        next()
      }
    }
  },
  watch: {}
}
</script>

<style lang='less' scoped>
.box {
  padding: 21px 12px;
  text-align: left;
  .question-box {
    background: rgba(255, 255, 255, 1);
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 20px;
    &.active {
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      padding: 7px 16px;
    }
    .ques-name {
      font-weight: 600;
      margin-bottom: 14px;
    }
    .answer {
      padding: 5px;
      border-radius: 15px;
      margin-bottom: 10px;
      padding-left: 0.2rem;
      &.right {
        background: rgba(19, 212, 153, 0.22)
          url(http://studioimage.yxj.org.cn/1545899946191.png) no-repeat 90%
          center;
        background-size: 0.2rem auto;
      }
      &.wrong {
        background: rgba(255, 39, 39, 0.22)
          url(http://studioimage.yxj.org.cn/1545899956608.png) no-repeat 90%
          center;
        background-size: 0.2rem auto;
      }
      &.selected {
        color: #fff;
        background: rgba(75, 50, 227, 0.5);
      }
    }

    .input {
      .input-box {
        width: 100%;
        height: 223px;
        background: rgba(242, 243, 245, 0.4);
        border-radius: 4px;
        border: 1px solid rgba(151, 151, 151, 0.4);
      }
      textarea {
        width: 100%;
        height: 100%;
        padding: 10px;
        background-color: transparent;
        border: 0;
        resize: none;
      }
    }
    .commit {
      // width: 3.2rem;
      padding: 0 5px;
      height: 44px;
      line-height: 44px;
      border-radius: 22px;
      background: linear-gradient(
        315deg,
        rgba(32, 42, 161, 1) 0%,
        rgba(75, 50, 228, 1) 100%
      );
      box-shadow: -2px 2px 10px 0px rgba(74, 49, 227, 0.5);
      border-radius: 22px;
      color: #fff;
      text-align: center;
      font-size: 16px;
      margin: 30px auto 7px;
      &.active {
        opacity: 0.5008;
      }
    }
  }

  .tab {
    font-size: 15px;
    color: #4a4a4a;
    line-height: 43px;
    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
    font-weight: 700;
    padding-left: 0.33rem;
    background: url("src1/assets/icons/talk.png") no-repeat left center;
    background-size: 0.24rem auto;
    margin-bottom: 10px;
    .hand {
      width: 109px;
      position: absolute;
      left: 30%;
      top: 7px;
    }
  }

  .list-item {
    .img {
      width: 1.14rem;
      height: 0.86rem;
      border-radius: 5px;
      float: left;
      overflow: hidden;
      img {
        border-radius: 5px;
      }
    }
    .item-info {
      overflow: hidden;
      padding: 3px 0 0 10px;
      line-height: 20px;
      height: 0.86rem;
      .title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .nums {
        font-size: 10px;
        color: #9b9b9b;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding-left: 10px;
        .read {
          float: left;
          padding-left: 0.25rem;
          background: url("src1/assets/icons/read.png") no-repeat left
            center;
          background-size: 0.2rem auto;
          margin-right: 0.24rem;
        }
        .praise {
          float: left;
          padding-left: 0.22rem;
          background: url("src1/assets/icons/praise.png") no-repeat left
            center;
          background-size: 0.16rem auto;
        }
        .date {
          float: right;
        }
      }
    }
  }
}
</style>
