<template>
  <div class="recommendRule">
    <div class="recommendRule_box">
      <div class="recommendRule_group">
        <h3 class="tit">活动背景</h3>
        <p class="desc">傲美云学院将每月根据销售代表的以下几个维度， 进行排名，前三名评选为当月推广之星，会有额外奖励的</p>
      </div>
    </div>
    <div class="recommendRule_box">
      <div class="recommendRule_group">
        <h3 class="tit">评选额度</h3>
        <ul class="ed">
          <li>
            <i class="dot"></i>
            <span>绑定医生参数：代表绑定医生人数</span>
          </li>
          <li>
            <i class="dot"></i>
            <span>推送内容参数：代表推送给绑定医生的文章、视频数/100</span>
          </li>
          <li>
            <i class="dot"></i>
            <span>医生积分参数：代表绑定医生的积分总和/100</span>
          </li>
          <li>
            <i class="dot"></i>
            <span>直播报名参数：代表绑定医生的报名直播次数总和</span>
          </li>
          <li>
            <i class="dot"></i>
            <span>医生提问参数：代表绑定医生的学术同期声提问次数总和</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="recommendRule_box">
      <div class="recommendRule_group">
        <h3 class="tit">计算规则</h3>
        <p class="desc">评选总分=绑定医生参数+推送内容参数+医生积 分参数+直播报名参数+医生提问参数</p>
      </div>
    </div>
    <div class="recommendRule_box">
      <div class="recommendRule_group">
        <h3 class="tit">评选周期</h3>
        <p class="desc">月榜：统计上个月的相关数量</p>
        <p class="desc">总榜：通知本周之前的数据</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import share from '../../../utils/share'

export default {
  created () {
    changeTitle('评选规则')
    this.hideLoad()
    share({
      title: '傲美云学院',
      desc: '智能学院在手，心血管医学知识一网打尽 ！',
      link: `${location.origin}${location.pathname}#/`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
    })
  },
  methods: {
    ...mapMutations(['hideLoad'])
  }
}
</script>
<style lang="less" scoped>
.recommendRule {
  &_box {
    text-align: left;
  }
  &_group {
    padding: 0.2rem 0.1rem 0.1rem 0.1rem;
    .tit {
      font-size: 0.18rem;
      margin-bottom: 0.13rem;
    }
    .desc {
      font-size: 0.16rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 1.5;
    }
    .ed {
      padding-left: 5px;
      .dot {
        display: inline-block;
        width: 5px;
        height: 5px;
        background: #9d6ef8;
        border-radius: 50%;
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        margin-left: 5px;
        font-size: 0.16rem;
        font-weight: 400;
        color: #666666;
        line-height: 1.5;
      }
    }
  }
}
</style>
