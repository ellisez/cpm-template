<template>
    <div>
        <div class="tips" v-if="showSurvey">
            为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，期待您的参与~
        </div>
        <div class="tips" v-if="!showSurvey">该调研暂未开放，感谢您的参与~</div>
        <div class="questions" v-for="(item,index) in tTopic" :key="index" :index="index">
            <div class="subtitle">
                <p v-if="item.topicType == '2'">{{index+1}}. {{item.topicName}}<span>[简答题]</span></p>
                <p v-else>{{index+1}}. {{item.topicName}}<span v-text="item.topicType == '0'?'[单选]':'[多选]'"></span></p>
            </div>
            <div class="qOptions" v-if="item.topicType == '2'">
                <textarea name="name" rows="" cols="" v-model="textareaValue"></textarea>
            </div>
            <div class="options" v-else
             v-for="(option,key) in item.itemCodes.split('||')" :key="key">
                <label>
                    <input
                    :type="item.topicType === '0' ? 'radio' : 'checkbox'"
                    :name="item.id"
                    :value="option"
                    >
                    <i class="icon icon-radio"></i>
                    <p class="options-text" >{{option}}.{{item.itemNames.split('||')[key]}}</p>
                </label>
            </div>
        </div>
        <x-button v-if='showSurvey' class="ft16" size="large" type="default"  @click="submit">提交</x-button>
    </div>
</template>

<script>
import storage from 'storejs'
import { mapMutations, mapGetters, mapActions } from 'vuex'
// import { baseUrl } from '../../interfaceUrl'
import { Button, Toast } from 'vant'
import { changeTitle } from '../../../utils/func'
export default {
  components: {
    xButton: Button
  },
  data () {
    return {
      tTopic: [],
      topicType: '',
      topicTypeMsg: '',
      textareaValue: '',
      showSurvey: false
    }
  },
  mounted () {
    changeTitle('调研')
    this.getSurveyList()
    this.hideLoad()
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '调研',
        EventID: '1',
        ControlName: '',
        Description: location.href
      })
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    ...mapMutations(['setUserInfo', 'hideLoad']),
    ...mapActions({
      getServey: 'content/getServey',
      answerTopic: 'content/answerTopic',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    async getSurveyList () {
      let code = this.$route.query.code
      let encrypt = storage.get('amy').encrypt
      let data = {
        code: code
      }
      // try {
      var res = await this.getServey(data)
      this.tTopic = res.data.list
      if (this.tTopic.length != 0) {
        this.showSurvey = true
      } else {
        this.showSurvey = false
      }
      // } catch (error) {
      //   Toast(error)
      // }
    },
    async submit () {
      let id = this.$route.query.code
      let refCode = this.$route.query.refCode
      let sourceType = this.$route.query.sourceType
      var encrypt = storage.get('amy').encrypt
      var companyCode = storage.get('amy').companyCode
      var areaCode = 'AMYXY'
      var listArr = this.tTopic
      var code = id
      var data = []

      for (var j = 0; j < listArr.length; j++) {
        var dataItem = {}
        if (listArr[j].topicType == '2') {
          dataItem.answer = this.textareaValue
        } else {
          var currentValue = []
          var currentValueArr = []
          var currentValueStr = ''
          currentValue = $('input[name=' + listArr[j].id + ']')
          for (var i = 0; i < currentValue.length; i++) {
            if (currentValue[i].checked == true) {
              currentValueArr.push(currentValue[i].value)
            }
          }
          currentValueStr = currentValueArr.join('||')
          dataItem.answer = currentValueStr
        }
        dataItem.sourceType = sourceType
        dataItem.refCode = refCode
        dataItem.topicCode = listArr[j].topicCode
        dataItem.surveyCode = code
        data.push(dataItem)
      }

      for (var z = 0; z < data.length; z++) {
        if (data[z].answer === '') {
          Toast('请完成答题后提交')
          return
        }
      }
      try {
        var res = await this.answerTopic(data)
        let score = res.data.score

        if (score > 0) {
          Toast('提交成功,获得积分' + score)
        }
        try {
          // 埋点
          this.baoSaveReport({
            PageName: '调研',
            EventID: '2',
            ControlName: '完成答题-提交答案',
            Description: location.href
          })
        } catch (error) {
          console.log(error)
        }
        this.$router.go(-1)
      } catch (error) {
        console.log(error)
        Toast(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/survey.less';
</style>
