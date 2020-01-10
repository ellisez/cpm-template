<template>
  <div class="audio-answer">
    <div class="top" v-show='value.isTop == "Y"'>
      <img v-show="voiceUrl.answerUrl == value.answerUrl && playing" src="../../assets/images/top.png" alt="">
      <img v-show="!(voiceUrl.answerUrl == value.answerUrl && playing)" src="../../assets/images/top.png" alt="">
    </div>
    <div class="user">
      <div class="name">【解答人】: {{ value.userName }}</div>
      <span>{{ value.positionName }}</span>
    </div>

    <div class="name hospital">{{ value.hospitalName }}</div>
    <div class="answer-info">
      <div class="listen" :class="{'playing':voiceUrl.answerUrl == value.answerUrl && playing}" @click="play">
        听专家怎么说
      </div>
      <div class="time">00:{{ value.voiceDuration }}</div>
      <div class="listen-num">{{ value.readNum }}</div>
    </div>
    <div
    v-show="userId == value.userId"
    @click="toAnswer"
    class="status"
    :class="{
      'auditing':value.status== 'A',
      'pass':value.status == 'B',
      'faild':value.status == 'C'
    }"
    >
    {{ value.status== 'A'?'审核中>>':value.status== 'B'?'已通过>>':'未通过>>' }}
    </div>

    <div class="praise" :class="{'active':active}" @click="zan">
      <span class="num">{{ praiseNum }}</span>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import storage from 'storejs'
import { Toast, Dialog } from 'vant'
export default {
  props: {
    value: {
      type: Object
    },
    player: {
      type: HTMLAudioElement
    },
    voiceUrl: {
      type: Object
    }
  },
  data () {
    return {
      playing: false,
      canReport: true,
      userId: storage.get(process.env.VUE_APP_STORAGE_NAME) ? storage.get(process.env.VUE_APP_STORAGE_NAME).userId : '',
      active: this.value.isVote == 1,
      praiseNum: this.value.praiseNum
    }
  },
  methods: {
    ...mapActions({
      reportReadNum: 'content/reportReadNum',
      setPraise: 'content/setPraise',
      baoSaveReport: 'ubt/baoSaveReport'
    }),

    toAnswer () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-答案列表',
          EventID: '2',
          ControlName: '审核状态',
          Description: '前往我的回答'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({ name: 'answer', query: { code: this.$route.query.code } })
    },

    async zan () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-答案列表',
          EventID: '2',
          ControlName: '点赞',
          Description: '点赞'
        })
      } catch (error) {
        console.log(error)
      }

      if (!storage.get(process.env.VUE_APP_STORAGE_NAME) || (storage.get(process.env.VUE_APP_STORAGE_NAME) && !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt)) {
        Dialog.confirm({
          title: '提示',
          message: '未登录无法进行此操作！',
          confirmButtonText: '去登录',
          cancelButtonText: '再看看',
          showCancelButton: true
        }).then(() => {
          // on confirm
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {
          // on cancel
        })
        return
      }
      if (this.loading) {
        return
      }
      this.loading = true
      var type = this.value.type
      var code = this.value.code
      var status = 1
      if (this.active) {
        status = 0
      }
      var data = {
        type,
        code,
        status
      }
      try {
        var res = await this.setPraise(data)

        this.active = !this.active
        if (status == 1) {
          this.praiseNum++
          Toast('点赞成功')
          try {
            // 埋点
            this.baoSaveReport({
              PageName: '组件-答案列表',
              EventID: '2',
              ControlName: '点赞',
              Description: '点赞成功'
            })
          } catch (error) {
            console.log(error)
          }
        } else {
          this.praiseNum--
          Toast('取消点赞')
          try {
            // 埋点
            this.baoSaveReport({
              PageName: '组件-答案列表',
              EventID: '2',
              ControlName: '点赞',
              Description: '取消点赞'
            })
          } catch (error) {
            console.log(error)
          }
        }

        this.loading = false
      } catch (error) {
        console.log(error)
        Toast(error)
      }
    },
    // 上报收听次数
    add () {
      var pageCode = '8'
      var code = this.value.code
      var data = {
        pageCode,
        code
      }
      this.reportReadNum(data)
    },
    play () {
      if (this.voiceUrl.answerUrl != this.value.answerUrl) {
        this.$emit('setUrl', this.value)
        this.player.src = this.value.answerUrl
        this.player.load()
        this.player.play()
        this.playing = true

        try {
          // 埋点
          this.baoSaveReport({
            PageName: '组件-答案列表',
            EventID: '2',
            ControlName: '播放录音',
            Description: this.value.code
          })
        } catch (error) {
          console.log(error)
        }
        if (this.canReport) {
          this.add()
          this.canReport = false
          setTimeout(() => {
            this.canReport = true
          }, 10000)
        }
      } else {
        if (this.playing) {
          this.player.pause()
          this.playing = false
        } else {
          this.player.play()
          this.playing = true
        }
      }
    }
  },
  watch: {
    player: {
      handler () {
        console.log(11111)
      },
      deep: true
    }
  }
}
</script>

<style lang='less' scoped>
@import url('../../style/answer.less');
</style>
