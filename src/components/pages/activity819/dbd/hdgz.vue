<template>
  <div class="activity819 hdgz">
    <div class="hdgz_top">
      <img src="../../../../assets/819/activity819Top.png" alt />
    </div>
    <div class="hdgz_con">
      <div class="hdgz_desc">
        <div class="duanhao_l"></div>
        <div class="duanhao_r"></div>
        <div class="hdgz_desc-tit">活动背景</div>
        <div class="hdgz_desc-con">
          傲美云学院代表端已经上线4个月，很多代表都已经加入，并参与绑定~
          炎炎夏日，酷暑难耐，感谢工作在一线的销售代表。
          <br />所以，趁着医师节，向所有销售代表推出“纳凉先锋”特别活动，活动期间，完成任务可以获得任务值，最后根据任务值排名，将对前十名进行奖励，惊喜大奖等着你，赶紧参与吧！
        </div>
      </div>
      <div class="hdgz_gzjs">
        <span></span>
      </div>
      <div class="gzCon">
        <div class="gzCon_bg"></div>
        <div class="gzCon_group">
          <div class="gzConTit">
            <span>领取任务</span>
          </div>
          <div class="gzCon_con">进入任务详情页，选择自己感兴趣的任务， 然后领取任务；</div>
        </div>
        <div class="gzCon_group">
          <div class="gzConTit">
            <span>完成任务</span>
          </div>
          <div class="gzCon_con">领取任务，可直接进行完成或进入《我的 任务》，去完成</div>
        </div>
        <div class="gzCon_group">
          <div class="gzConTit">
            <span>获得积分</span>
          </div>
          <div class="gzCon_con">每个任务根据难度的不同，设置了不同的 积分，完成任务即可获得积分；</div>
        </div>
        <div class="gzCon_group">
          <div class="gzConTit">
            <span>提高排名</span>
          </div>
          <div class="gzCon_con">积分高低，会影响《纳凉先锋墙》的排名 不断完成任务，提高积分，提升排名；</div>
        </div>
        <div class="gzCon_group">
          <div class="gzConTit">
            <span>获得奖励</span>
          </div>
          <div class="gzCon_con">活动结束，根据排名，对前十名的用户， 进行奖励；</div>
        </div>
      </div>
      <!-- 规则时间 -->
      <div class="hdgz_gzjs sj">
        <span></span>
      </div>
      <div class="hdgz_gzsj">
        <p>任务时间：2019.08.16-2019.08.31</p>
        <p>获奖展示：2019.08.16-2019.08.31</p>
      </div>
      <!-- 按钮 -->
      <div class="hdgz_footer">
        <div class="top">
          <div class="btn lqrw" @click="$router.push({path:'/activity819'})">领取任务</div>
          <div
            class="btn wdrw"
            v-if="taskData"
            @click="$router.push({path:'/mytask'})"
          >我的任务({{taskData.totalValue}}分)</div>
        </div>
        <div class="btn nlxfq" @click="$router.push({path:'/nlxfq'})">纳凉先锋墙</div>
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
export default {
  data () {
    return {
      isRepresent: 'Y', // Y 代表 N 不是代表
      taskData: null
    }
  },
  created () {
    changeTitle('纳凉先锋')
    this.hideLoad()
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
    this._getMyTask()
    share({
      title: '傲美云学院8·19中国医师节之特别策划--纳凉先锋',
      desc: '完成任务，获取奖励！',
      link: `${location.origin}${location.pathname}#/hdgz`,
      imgUrl: 'https://imageysz.yxj.org.cn/1565599191731.png'
    })
    try {
      this.baoSaveReport({
        PageName: '819医师节活动-代表端--纳凉先锋',
        EventID: '1',
        ControlName: '819医师节活动-代表端--纳凉先锋',
        Description: '819医师节活动-代表端--纳凉先锋'
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
     * 获取我的任务
     */
    _getMyTask () {
      this.taskData = null
      let params = {
        code: '2'
      }
      this.showNetLoad()
      serviceApi.resultRepresentationalInfo(params).then(res => {
        this.taskData = res.data
        this.hideLoad()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.gzCon {
  width: 3.13rem;
  border-radius: 0.1rem;
  //   min-height: 100%;
  height: 5.5rem;
  margin: 0.2rem auto 0 auto;
  position: relative;
  background: #009cbd;
  padding-top: 0.55rem;
  &_bg {
    width: 0.9rem;
    height: 0.32rem;
    background: url(../../../../assets/819/gzCon_tit.png) no-repeat no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 0.1rem;
    left: -0.06rem;
  }
  .gzCon_group {
    margin-bottom: 0.2rem;
    .gzCon_con {
      color: #fff;
      font-size: 0.14rem;
      text-align: left;
      padding: 0 0.25rem;
      margin-top: 0.1rem;
    }
    .gzConTit {
      width: 1.99rem;
      height: 0.3rem;
      margin: 0 auto;
      line-height: 0.3rem;
      font-size: 0.14rem;
      color: #2bfde4;
      text-align: center;
      background: rgba(0, 126, 153, 1);
      border-radius: 0.15rem;

      & > span {
        display: inline-block;
        &::after {
          content: "";
          display: inline-block;
          width: 0.04rem;
          height: 0.04rem;
          border-radius: 50%;
          background: #ffc81a;
          vertical-align: middle;
          margin-left: 5px;
        }
        &::before {
          content: "";
          display: inline-block;
          width: 0.04rem;
          height: 0.04rem;
          border-radius: 50%;
          background: #ffc81a;
          vertical-align: middle;
          margin-right: 5px;
        }
      }
    }
  }
}
.hdgz {
  width: 100%;
  //   min-height: 100%;
  height: 100%;
  background: #39b9d4;
  &_top {
    width: 100%;
    height: 2.11rem;
    & > img {
      height: 100%;
    }
  }
  &_con {
    background: #39b9d4;
    margin-top: -0.16rem;
    padding-bottom: 0.2rem;
  }
  &_gzjs {
    width: 1.65rem;
    height: 0.4rem;
    margin: 0.2rem auto 0 auto;
    line-height: 0.4rem;
    font-size: 0.2rem;
    text-align: center;
    color: #fff;
    background: url(../../../../assets/819/hdgz_gzjs.png) no-repeat no-repeat;
    background-size: contain;
    &.sj {
      background: url(../../../../assets/819/hdgz_gzsj.png) no-repeat no-repeat;
      background-size: contain;
    }
  }
  &_desc {
    width: 2.8rem;
    margin: 0.3rem auto 0 auto;
    color: #fff;
    font-size: 0.14rem;
    text-align: left;
    &-tit {
      text-align: center;
      margin-bottom: 0.03rem;
    }
    .duanhao_l {
      width: 0.43rem;
      height: 0.31rem;
      background: url(../../../../assets/819/dunhao_l.png) no-repeat no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: -0.2rem;
      top: -0.15rem;
    }
    .duanhao_r {
      width: 0.43rem;
      height: 0.31rem;
      background: url(../../../../assets/819/dunhao_r.png) no-repeat no-repeat;
      background-size: 100% 100%;
      position: absolute;
      right: -0.4rem;
      bottom: -0.2rem;
    }
    &-con {
    }
  }
  .hdgz_gzsj {
    width: 3.13rem;
    height: 0.67rem;
    border-radius: 0.08rem;
    margin: 0 auto;
    position: relative;
    background: #009cbd;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.5;
    margin-top: 0.2rem;
  }
  .hdgz_footer {
    width: 3.13rem;
    margin: 0 auto;
    .top {
      display: flex;
      margin-bottom: 0.1rem;
      margin-top: 0.5rem;
    }
    .btn {
      width: 100%;
      height: 0.4rem;
      background: #ffc827;
      border-radius: 0.08rem;
      color: #fff;
      line-height: 0.4rem;
      &.lqrw {
        background: #2efcff;
        margin-right: 10px;
      }
      &.wdrw {
        background: #0065dc;
      }
    }
  }
}
</style>
