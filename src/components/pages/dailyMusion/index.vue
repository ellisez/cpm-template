<template>
  <div>
    <!--pages/tsd/earnPoints/earnPoints.wxml-->
    <div class='content'>
      <div class='exchange'>
        <div class='up'>{{ goodsPrice.userIntegral > goodsPrice.score ?'当前已可兑换礼品':'还差' + (goodsPrice.score-goodsPrice.userIntegral) + '积分即可兑换礼品' }}</div>
        <div class='down'>已拥有：{{ goodsPrice.userIntegral }}积分</div>

        <div class='exchange-btn' @click='toMall'>立即兑换</div>
      </div>

      <div class='rules '>

        <div class='list rule-title'>
          <div class='name'>任务项</div>
          <div class='score'>获得积分数</div>
          <div class='btn-box'>
          </div>
        </div>

        <div class='list'>
          <div class='name'>完善账号信息</div>
          <div class='score'>100</div>
          <div class='btn-box'>
            <div class='over-btn' :class="{'overd': userType =='B'}" @click='toSetting'>{{ userType =='B'?"已完成":'去完成' }}</div>
          </div>
        </div>

        <div class='list'>
          <div class='name'>阅读文章/文献</div>
          <div class='score'>1/次</div>
          <div class='btn-box'>
            <div class='over-btn' :class='{"overd":taskInfo.isRead> 0}' @click='toArticle'>{{ taskInfo.isRead> 0?"已完成":"去完成" }}</div>
          </div>
        </div>

        <div class='list'>
          <div class='name'>观看视频</div>
          <div class='score'>10/次</div>
          <div class='btn-box'>
            <div class='over-btn' :class='{"overd":taskInfo.isTime> 0}' @click='toVideo'>{{ taskInfo.isTime> 0?"已完成":"去完成" }}</div>
          </div>
        </div>

        <!-- <div class='list'>
          <div class='name'>参与调研</div>
          <div class='score'>50/套</div>
          <div class='btn-box'> -->
            <!-- <div class='over-btn'>去完成</div> -->
          <!-- </div>
        </div> -->
    <!--
        <div class='list'>
          <div class='name'>提交病例</div>
          <div class='score'>100/套</div>
          <div class='btn-box'>
            <div class='over-btn'>去完成</div>
          </div>
        </div> -->

        <!-- <div class='list'>
          <div class='name'>每日一听</div>
          <div class='score'>3/次</div>
          <div class='btn-box'>
            <div class='over-btn' :class='{"overd":taskInfo.isListen> 0}' @click='toListen'>{{ taskInfo.isListen> 0?"已完成":"去完成" }}</div>
          </div>
        </div> -->

        <div class='list'>
          <div class='name'>达人挑战</div>
          <div class='score'>10/次</div>
          <div class='btn-box'>
            <div class='over-btn' :class='{"overd":taskInfo.isTopicPass> 0}' @click='toNewsletter'>{{ taskInfo.isTopicPass> 0?"已完成":"去完成" }}</div>
          </div>
        </div>
        <div class='list'>
          <div class='name'>学术同期声</div>
          <div class='score'>5/次</div>
          <div class='btn-box'>
            <div class='over-btn' :class='{"overd":taskInfo.isQuestion> 0}' @click='toXueshu'>{{ taskInfo.isQuestion> 0?"已完成":"去完成" }}</div>
          </div>
        </div>
        <div class='list'>
          <div class='name'>评论</div>
          <div class='score'>1/次</div>
          <div class='btn-box'>
            <div class='over-btn' :class='{"overd":taskInfo.isComment> 0}' @click='toIndex'>{{ taskInfo.isComment> 0?"已完成":"去完成" }}</div>
          </div>
        </div>

      </div>

      <div class='remark'>备注：24小时内相同操作不重复发放积分兑换商品需要完善信息哦</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import storage from 'storejs'
import { Dialog } from 'vant'
import { changeTitle } from '../../../utils/func'
export default {
  created () {
    this.getlowestGoods()
    this.gettaskCheck()
    changeTitle('日常任务')
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '日常任务',
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
  },
  data () {
    return {
      goodsPrice: '',
      userType: storage.get(process.env.VUE_APP_STORAGE_NAME).userType,
      taskInfo: ''
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      lowestGoods: 'content/lowestGoods',
      taskCheck: 'content/taskCheck',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    // 查询最低商品价格
    async getlowestGoods () {
      try {
        var res = await this.lowestGoods({})
        console.log(res)
        this.goodsPrice = res.data
      } catch (err) {
        console.log(err)
      }
    },
    async gettaskCheck () {
      try {
        var res = await this.taskCheck({})
        console.log(res)
        this.taskInfo = res.data
      } catch (err) {
        console.log(err)
      }
    },

    toMall () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '日常任务',
          EventID: '2',
          ControlName: '进入商城',
          Description: '点击进入'
        })
      } catch (error) {
        console.log(error)
      }
      if (storage.get(process.env.VUE_APP_STORAGE_NAME).realnameAuthStatus != 'C') {
        Dialog.alert({
          message: '请完成认证信息后兑换商品'
        }).then(() => {
          // on close
          this.$router.push({
            path: '/setting',
            query: {
              from: 123
            }
          })
        })
        return
      }

      try {
        // 埋点
        this.baoSaveReport({
          PageName: '日常任务',
          EventID: '2',
          ControlName: '进入商城',
          Description: '成功进入商城'
        })
      } catch (error) {
        console.log(error)
      }
      location.href = `${window.location.origin}/mall/#/?shopEncrypt=${storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt}&userId=${storage.get(process.env.VUE_APP_STORAGE_NAME).userId}&areaCode=${process.env.VUE_APP_AREA_CODE}&companyCode=${process.env.VUE_APP_COMPANY_CODE}`
    },
    toSetting () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '日常任务',
          EventID: '2',
          ControlName: '进入完善信息',
          Description: '完善信息'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/setting'
      })
    },
    toArticle () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '日常任务',
          EventID: '2',
          ControlName: '阅读文章/文献',
          Description: '阅读文章/文献'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/frontier',
        query: {
          modelCode: 'AMYXY-HYZX'
        }
      })
    },
    toVideo () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '日常任务',
          EventID: '2',
          ControlName: '观看视频',
          Description: '观看视频'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/information'
      })
    },
    toNewsletter () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '日常任务',
          EventID: '2',
          ControlName: '答题闯关',
          Description: '答题闯关'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/newsletter'
      })
    },
    toIndex () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '日常任务',
          EventID: '2',
          ControlName: '评论',
          Description: '评论'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/'
      })
    },
    toXueshu () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '日常任务',
          EventID: '2',
          ControlName: '学术同期声',
          Description: '学术同期声'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/academicsync'
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import url('../../../style/dailymusion.less');
</style>
