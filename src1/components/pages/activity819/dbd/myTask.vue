<template>
  <div class="activity819 myTask">
    <div class="taskHeader">
      <div class="tabHeader">
        <div
          :class="['tab_item',index===tabActive?'active':'']"
          v-for="(item,index) in tab"
          :key="index"
          @click="changeTab(index)"
        >
          <span>{{item}}</span>
        </div>
      </div>
    </div>
    <div class="myDesc" v-if="taskData">
      <span>我的任务值：{{taskData.totalValue}}分</span>
      <span class="myDescGap"></span>
      <span>我的排名：{{taskData.orderNo}}</span>
    </div>
    <!-- 内容 -->
    <div class="myTack_con">
      <div class="list" v-if="taskData">
        <!-- star -->
        <div
          class="taskWrap"
          v-for="(item,index) in taskData.dRepresentationalTaskDetailList"
          :key="index"
        >
          <div class="taskWrap_avatar">
            <img :src="require(`./src1/assets`)" alt />
          </div>
          <div class="taskWrap_middle">
            <div class="tit">任务名称：{{item.taskName}}</div>
            <div class="taskWrap_row">
              <span>
                <img src="src1/assets/819/renwu.png" alt />
                任务难度：{{item.taskDifficulty}}
              </span>
              <span>
                <img src="src1/assets/819/fenshu.png" alt />
                任务值：{{item.taskValue}}分
              </span>
            </div>
            <div class="taskWrap_row">
              <span>
                <img src="src1/assets/819/shijian.png" alt />
                完成进度：{{item.completeProgress}}%
              </span>
            </div>
          </div>
          <div class="taskWrap_right">
            <y-button
              type="mytask"
              :disabled="item.status==='1'"
              :class="[isActivityEnd?'isActivityEnd':'']"
              @handleClick="goTask(item)"
            >{{item.status==='1'?'已完成':'去完成'}}</y-button>
          </div>
        </div>
        <div class="nothing" v-if="taskData.dRepresentationalTaskDetailList.length === 0">
          <img src="src1/assets/819/nothing_task.png" alt />
        </div>
        <!-- end -->
      </div>
    </div>
    <!-- 活动规则 -->
    <div class="hdgz" @click="$router.push({path:'/hdgz'})"></div>
    <!-- 底部 -->
    <div class="mytask_footer">
      <div class="mytask_footer_wrap">
        <div class="taskBtn lqrw" @click="$router.push({path:'/activity819'})">领取任务</div>
        <div class="taskBtn nlxfq" @click="$router.push({path:'/nlxfq'})">纳凉先锋墙</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUrlParam } from '@/utils/func'
import { mapActions, mapMutations } from 'vuex'
import storage from 'storejs'
import yButton from '@/components/common/yButton'
import share from '../../../../utils/share'
import serviceApi from '../../../../api/serviceAPI'
import mixin819 from '../../../../utils/mixin819'
import { Toast } from 'vant'
export default {
  components: {
    yButton
  },

  mixins: [mixin819],
  data () {
    return {
      tab: ['一星', '二星', '三星', '四星', '五星'],
      tabActive: 0,
      isRepresent: 'Y', // Y 代表 N 不是代表
      taskData: { dRepresentationalTaskDetailList: [] }, // 任务数据
      isActivityEnd: false // 活动是否结束
    }
  },
  created () {
    changeTitle('我的任务')
    //  c初始化819 时间
    this.init819Activity().then(res819 => {
      this.isActivityEnd = this.is_activity === 2
      //   this.isActivityEnd = true;
    })

    this.hideLoad()
    this.isRepresent = storage.get('userInfoAMY') ? 'Y' : 'N'
    if (this.isRepresent !== 'Y') {
      // 如果为非代表用户，进入专区首页
      this.$router.push({
        path: '/'
      })
    }
  },
  mounted () {
    this.changeTab(0)
    share({
      title: '纳凉先锋--我的任务',
      desc: '完成任务，获取奖励！',
      link: `${location.origin}${location.pathname}#/mytask`,
      imgUrl: 'https://imageysz.yxj.org.cn/1565599191731.png'
    })
    try {
      this.baoSaveReport({
        PageName: '819医师节活动-代表端-我的任务',
        EventID: '1',
        ControlName: '819医师节活动-代表端-我的任务',
        Description: '819医师节活动-代表端-我的任务'
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
     * 测试 做任务改变状态
     * @param taskType 任务类型(0:绑定医生1:推送内容2:观看直播3:同期声文字提问)
     */
    _updateValueByType () {
      let params = {
        taskType: 0,
        doctorMobile: '',
        docotrId: '',
        content: 'ddd',
        shareType: '0'
      }
      serviceApi.updateValueByType().then(res => {})
    },
    /**
     * 改变不同的星级
     */
    changeTab (index) {
      this.tabActive = index
      this._getMyTask(index)
    },
    /**
     * 获取我的任务
     */
    _getMyTask (index = 0) {
      let i = index + 1
      this.taskData.dRepresentationalTaskDetailList = []
      let params = {
        code: '1',
        taskDifficulty: i + ''
      }
      this.showNetLoad()
      serviceApi.resultRepresentationalInfo(params).then(res => {
        this.taskData = res.data
        this.hideLoad()
      })
    },
    /**
     * 去完成
     */
    goTask (item) {
      console.log(item, '去完成')
      console.log(this.is_activity, '领取任务-is_activity')
      if (this.is_activity === 0) {
        Toast('活动未开始')
        return
      }
      if (this.is_activity === 2) {
        Toast('活动已结束')
        return
      }
      let taskType = item.taskType // 任务类型(0:绑定医生1:推送内容2:观看直播3:同期声文字提问)
      let target = '/'
      switch (taskType) {
        case '0':
          target = '/qrCodeDBT'
          break
        case '1':
          target = '/information'
          break
        case '2':
          target = '/youngspeakers'
          break
        case '3':
          target = '/academicsync'
          break
        default:
          target = '/'
      }
      this.$router.push({
        path: target,
        query: { source: 'myTask' }
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
.myTack_con {
  padding-bottom: 1rem;
}
.nothing {
  display: flex;
  width: 100%;
  justify-content: center;
  padding-top: 20px;
  & > img {
    width: 2.03rem;
    height: 1.88rem;
  }
}
.isActivityEnd {
  background: #ccc !important;
}
.myTask {
  background: #f7f9fc;
}
.y-button.y-button-mytask {
  border-radius: 0.13rem;
  background: #38b9d4;
  border: none;
  color: #fff;
}
.taskHeader {
  width: 100%;
  height: 0.44rem;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08);
}
.tabHeader {
  width: 100%;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.15rem 0.15rem 0 0.15rem;
  height: 0.44rem;
  .tab_item {
    padding: 0 10px;
    font-size: 0.14rem;
    color: #b3b6c0;
    &.active {
      color: #333;
      font-weight: 700;
    }
    &.active::after {
      content: "";
      width: 24px;
      height: 4px;
      display: block;
      background: #38b9d4;
      color: #666;
      margin: 6px auto 0;
      border-radius: 100px 100px 0 0;
    }
  }
}
.myDesc {
  width: 100%;
  text-align: center;
  color: #38b9d4;
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
.taskWrap {
  padding: 0.15rem;
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  justify-content: space-between;
  width: 3.43rem;
  height: 1.13rem;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(240, 242, 248, 0.8);
  border-radius: 0.16rem;
  margin: 0 auto 0.15rem auto;
  &_avatar {
    width: 0.44rem;
    height: 0.44rem;
    align-self: center;
    & > img {
      width: 0.44rem;
      height: 0.44rem;
      border-radius: 50%;
    }
  }
  &_middle {
    margin-left: 0.1rem;
    .tit {
      font-size: 0.15rem;
      color: #333;
      text-align: left;
      margin-bottom: 0.06rem;
    }
    .taskWrap_row {
      font-size: 0.14rem;
      color: #9a99a8;
      line-height: 1.5;
      text-align: left;
      img {
        width: 0.12rem;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
.mytask_footer {
  width: 100%;
  height: 0.83rem;
  background: #fff;
  padding-top: 0.1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  &_wrap {
    width: 3.43rem;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    .taskBtn {
      width: 0.88rem;
      height: 0.32rem;
      background: rgba(56, 185, 212, 1);
      border-radius: 8px;
      color: #fff;
      line-height: 0.32rem;
      text-align: center;
      &.lqrw {
        background: rgba(243, 243, 243, 1);
        color: #38b9d4;
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
