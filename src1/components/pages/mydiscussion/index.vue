<template>
  <div>
    <div class="tabs">
      <div class="tab-item" :class="{'active':tabIndex == 1}" @click="checkTab(1)">我的发布</div>
      <div class="tab-item" :class="{'active':tabIndex == 2}" @click="checkTab(2)">我的互动</div>
    </div>

    <div class="lists" v-show="tabIndex == 1">

      <release v-for="(item,index) in quesList" :key="index" :value='item'/>

    <!-- 底部提示 -->
    <div class="no-more">
      <div class="none" v-show="tabIndex == 1 && quesList.length > 0">我是有底线的~</div>
      <div class="nothing" v-show="tabIndex == 1 && quesList.length == 0">
        <img src="src1/assets/images/nothing.png" alt="">
        <div class="txt-info">暂无内容</div>
      </div>
    </div>

    </div>

    <div class="lists" v-show="tabIndex == 2">

      <interaction v-for="(item,index) in answerList" :voiceUrl='voiceUrl' :player='player' @setUrl='setUrl' :key="index" :value='item'/>

    <!-- 底部提示 -->
    <div class="no-more">
      <div class="none" v-show="tabIndex == 2 && answerList.length > 0">我是有底线的~</div>
      <div class="nothing" v-show="tabIndex == 2 && answerList.length == 0">
        <img src="src1/assets/images/nothing.png" alt="">
        <div class="txt-info">暂无内容</div>
      </div>
    </div>

    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import release from '../../lists/release'
import interaction from '../../lists/interaction'
import { changeTitle } from '../../../utils/func'
export default {
  components: {
    release, interaction
  },
  created () {
    changeTitle('我的同期声')
    this.player = new Audio()
    this.player.addEventListener('play', () => {
      console.log('录音播放', this.player)
    })
    this.player.addEventListener('pause', () => {
      console.log('录音暂停', this.player)
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
    this.getMySend()
    this.getMyAnswer()

    try {
      // 埋点
      this.baoSaveReport({
        PageName: '我的同期声',
        EventID: '1',
        ControlName: '',
        Description: ''
      })
    } catch (error) {
      console.log(error)
    }
  },
  activated () {
    changeTitle('我的同期声')
    this.tabIndex = this.$route.query.index || this.tabIndex
  },
  mounted () {
    this.hideLoad()
  },
  data () {
    return {
      tabIndex: 1,
      quesList: [],
      answerList: [],
      voiceUrl: {}
    }
  },
  beforeDestroy () {
    this.player.pause()
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      serarProblem: 'content/serarProblem',
      getAnsweredQues: 'content/getAnsweredQues',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    setUrl (url) {
      console.log(url)
      this.voiceUrl = url
    },
    // 栏目选择
    checkTab (index) {
      this.tabIndex = index
    },
    async getMySend () {
      try {
        var res = await this.serarProblem({})
        console.log(res)
        this.quesList = res.data
      } catch (error) {
        console.log(error)
      }
    },
    async getMyAnswer () {
      try {
        var res = await this.getAnsweredQues({})
        this.answerList = res.data
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    console.log(to.meta.keepAlive)
    if (from.name == 'self') {
      to.meta.keepAlive = true
      to.query.index = 1
    } else {
      to.query.index = ''
      to.meta.keepAlive = true
    }
    next()
  }
}
</script>
<style lang="less" scoped>
  @import url('src1/styleiscussion.less');
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
