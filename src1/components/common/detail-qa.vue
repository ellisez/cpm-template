<template>
<div class='qa'>
  <div class='info'>

    <div class='item' v-for='(item,index) in topic' :key="index">
      <div>{{ index + 1 }}、{{ item.ques }}（{{ item.type == 0?"单选":"多选" }}）</div>

      <div
        @click='select({index1:index,index2:i})'
        class='answer'
        v-for='(e,i) in item.answerList'
        :key="i"
        :class="{'select':e.selected && !answered,'right':e.isAnswer &&answered,'wrong':!e.isAnswer && e.selected && answered}"
        >{{ e.answer }}</div>
    </div>

    <div
      class='commit '
      :class="{'answered':answered}"
      @click='commit'

      >{{ answered?"已回答":"提交" }}</div>
  </div>

</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    code: {
      type: String
    },
    triggerEvent: {
      type: Function
    }
  },
  data () {
    return {
      answered: false,
      topic: []
    }
  },
  methods: {
    ...mapActions({
      getTopics: 'content/getTopics',
      answerTopic: 'content/answerTopic',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    async getInfo () {
      try {
        var data = {
          code: this.$route.query.code
        }
        var res = await this.getTopics(data)
        var list = res.data.tTopic
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
        this.answered = res.data.isTopicFlag == 1
        this.$emit('triggerEvent', this.topic.length)
      } catch (err) {
        console.log(err)
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
      if (list[indexs.index1].type == 1) {
        list[indexs.index1].answerList[indexs.index2].selected = !list[indexs.index1].answerList[indexs.index2].selected
      } else {
        list[indexs.index1].answerList.forEach(ele => {
          ele.selected = false
        })
        list[indexs.index1].answerList[indexs.index2].selected = !list[indexs.index1].answerList[indexs.index2].selected
      }
      this.topic = list
    },
    // 提交
    async commit () {
      if (this.answered) {
        return
      }
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-文内答题',
          EventID: '2',
          ControlName: '提交',
          Description: location.href
        })
      } catch (error) {
        console.log(error)
      }
      var list = this.topic
      var answerList = []
      list.forEach(ele => {
        console.log(ele)
        var arr = []
        ele.answerList.forEach(ele => {
          if (ele.selected) {
            arr.push(ele.answer.slice(0, 1))
          }
        })
        var obj = {
          code: this.code,
          topicCode: ele.code,
          answer: arr.join('||')
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
      try {
        var res = await this.answerTopic(answerList)
        console.log(res)
        this.answered = true
      } catch (err) {
        console.log(err)
        this.answered = true
      }
    }
  },
  watch: {
    '$route' (to, from) {
    }
  }
}
</script>

<style lang='less' scoped>
@import 'src1/styledetail-qa.less';
</style>
