<template>
  <div class="activity819 nlxfq">
    <div class="nlxfq_wrap">
      <div class="myDesc" v-if="nlData">
        <span>我的任务值：{{nlData.totalValue}}分</span>
        <span class="myDescGap"></span>
        <span>我的排名：{{nlData.orderNo}}</span>
      </div>
      <!-- 内容 -->
      <div class="nlxfq_con">
        <div class="list" v-if="nlData">
          <div class="nlxfq_item" v-for="(item,index) in nlData.dTaskOrderList" :key="index">
            <div class="iconW" v-if="index <3">
              <img :src="require(`./src1/assets`)" alt />
            </div>
            <div class="nlxfq_avatar">
              <!-- {{'champion'+index}} -->
              <!-- {{`../../../../assets/819/champion${index}.png`}} -->
              <img :src="require(`./src1/assets`)" alt />
            </div>
            <div class="nlxfq_name">
              <span>{{item.userName}}</span>
            </div>
            <div class="nlxfq_task">
              <span>任务分值：{{item.totalValue}}分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 活动规则 -->
    <div class="hdgz" @click="$router.push({path:'/hdgz'})"></div>
    <!-- <div class="nlxxf_f_bg">
      <img src="../../../../assets/819/nlxxf_f_bg.png" alt />
    </div>-->
    <!-- 底部 -->
    <div class="mytask_footer">
      <div class="mytask_footer_wrap">
        <div class="taskBtn lqrw" @click="$router.push({path:'/activity819'})">领取任务</div>
        <div
          class="taskBtn nlxfq"
          v-if="nlData"
          @click="$router.push({path:'/mytask'})"
        >我的任务({{nlData.totalValue}}分)</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUrlParam } from '@/utils/func'
import { mapActions, mapMutations } from 'vuex'
import storage from 'storejs'
import share from '../../../../utils/share'
import serviceApi from '../../../../api/serviceAPI'
import mixin819 from '../../../../utils/mixin819'
export default {
  mixins: [mixin819],
  data () {
    return {
      isRepresent: 'Y', // Y 代表 N 不是代表
      nlData: null
    }
  },
  created () {
    changeTitle('纳凉先锋墙')
    this.isRepresent = storage.get('userInfoAMY') ? 'Y' : 'N'
    if (this.isRepresent !== 'Y') {
      // 如果为非代表用户，进入专区首页
      this.$router.push({
        path: '/'
      })
    }
    // this.authorWeixin();
  },
  mounted () {
    this._getNlxfq()
    share({
      title: '纳凉先锋--纳凉先锋墙',
      desc: '完成任务，获取奖励！',
      link: `${location.origin}${location.pathname}#/nlxfq`,
      imgUrl: 'https://imageysz.yxj.org.cn/1565599191731.png'
    })
    try {
      this.baoSaveReport({
        PageName: '819医师节活动-代表端-纳凉先锋墙',
        EventID: '1',
        ControlName: '819医师节活动-代表端-纳凉先锋墙',
        Description: '819医师节活动-代表端-纳凉先锋墙'
      })
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    ...mapMutations(['hideLoad', 'showNetLoad']),
    ...mapActions({
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    /**
     * 获取
     */
    _getNlxfq () {
      this.nlData = null
      let params = {
        code: '2'
      }
      this.showNetLoad()
      serviceApi.resultRepresentationalInfo(params).then(res => {
        this.nlData = res.data
        this.hideLoad()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.activity819 {
  width: 100%;
  min-height: 100%;
}
.iconW {
  position: absolute;
  left: 10px;
  top: 0;
  & > img {
    width: 0.16rem;
  }
}
.nlxfq {
  //   background: linear-gradient(
  //     360deg,
  //     rgba(146, 244, 255, 1) 0%,
  //     rgba(45, 172, 200, 1) 100%
  //   );
  background: url(src1/assets/819/nlxxf_bg.png) no-repeat no-repeat;
  background-size: 100% 100%;
}
.nlxfqWrap {
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.04);
}
.myDesc {
  width: 100%;
  text-align: center;
  color: #00647a;
  font-size: 0.13rem;
  padding: 0.1rem 0;
  &Gap {
    width: 1px;
    height: 10px;
    display: inline-block;
    vertical-align: middle;
    background: #38b9d4;
    margin: 0 10px;
  }
}
.nlxfq_con {
  margin-top: 0.25rem;
  padding: 0 0.12rem;
  padding-left: 0.16rem;
}
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  //   justify-content: center;
}
.nlxxf_f_bg {
  width: 100%;
}
.nlxfq_item {
  width: 1.09rem;
  box-shadow: 0px 0px 16px 0px rgba(242, 244, 252, 0.48);
  border-radius: 8px;
  height: 0.68rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.2rem;
  margin-bottom: 0.3rem;
  margin-right: 5px;
  .nlxfq_avatar {
    position: absolute;
    top: -16px;
    img {
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 50%;
    }
  }
  .nlxfq_name {
    font-size: 0.13rem;
  }
  .nlxfq_task {
    font-size: 0.12rem;
    color: #9a99a8;
  }
}
.mytask_footer {
  width: 100%;
  position: fixed;
  bottom: 0.2rem;
  left: 0;
  &_wrap {
    width: 3.43rem;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    .taskBtn {
      width: 1.3rem;
      height: 0.39rem;
      background: url(src1/assets/819/nlxxf-my_bg.png) no-repeat
        no-repeat;
      background-size: 100% 100%;
      border-radius: 8px;
      color: #fff;
      line-height: 0.39rem;
      text-align: center;
      &.lqrw {
        background: url(src1/assets/819/nlxxf-my_bg-l.png) no-repeat
          no-repeat;
        background-size: 100% 100%;

        color: #fff;
      }
    }
  }
}
.hdgz {
  width: 0.44rem;
  height: 0.44rem;
  position: fixed;
  right: 0.2rem;
  z-index: 6666;
  bottom: 20%;
  background: url(src1/assets/icons/hdgz819.png) no-repeat 100%;
  background-size: contain;
}
</style>
