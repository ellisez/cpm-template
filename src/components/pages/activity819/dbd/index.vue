<template>
  <div class="activity819">
    <div class="taskSelect" @click.stop="dialogShow_task_select=true">任务难度选择</div>
    <div class="activity819_top">
      <img src="../../../../assets/819/activity819Top.png" alt />
    </div>
    <div class="activity819_con">
      <img src="../../../../assets/819/activity819_con.png" alt />
      <div class="activity819Game">
        <div
          :class="['task', `task${index+1}`]"
          v-for="(item,index) in taskArr"
          :key="item.id"
          @click="showTask(item)"
        ></div>
        <!-- <div class="activity819Game_bg"></div> -->
      </div>
    </div>
    <!-- 活动规则 -->
    <div class="hdgz" @click="$router.push({path:'/hdgz'})"></div>
    <!-- 底部 -->
    <div class="mytask_footer">
      <div class="mytask_footer_wrap">
        <div class="taskBtn" @click="$router.push({path:'/mytask'})">我的任务({{taskData.totalValue}}分)</div>
        <div class="taskBtn lqrw" @click="$router.push({path:'/nlxfq'})">纳凉先锋墙</div>
      </div>
    </div>
    <!-- 任务难度选择 -->
    <y-dialog :showModel="dialogShow_task_select" @hideDialog="hideDialogInfo_select">
      <div class="taskSelectDia">
        <div class="taskSelectDia_tit">
          <img src="../../../../assets/819/task_select.png" alt />
        </div>
        <div class="taskSelectDia_con">
          <div
            :class="['selectItem',`selectItem_${index}`]"
            v-for="(item,index) in taskDiff"
            :key="index"
            @click="selectStar(index)"
          >
            <div class="selectItem_txt">{{item.txt}}星</div>
            <div class="selectItem_con">
              <div class="star">
                <img
                  :src="require(`../../../../assets/819/${item.isClickStar?'star_active':'star'}.png`)"
                  v-for="(iItem,i) in index+1"
                  :key="i"
                  alt
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </y-dialog>
    <!-- 领取任务 -->
    <y-dialog :showModel="dialogShow_task" @hideDialog="hideDialogInfo">
      <div class="first819tk" :style="taskRandomBg">
        <div class="tit">任务卡</div>
        <div class="first819tk_desc" v-if="taskDetail">
          <p class="p1">任务名称：{{taskDetail.taskName}}</p>
          <p class="p2">
            <span class="inlineb">任务难度：</span>
            <span>
              <img
                src="../../../../assets/819/star_active.png"
                alt
                v-for="(item,index) in Number(taskDetail.taskDifficulty)"
                :key="index"
              />
            </span>
          </p>
          <p class="p3">任务值：{{taskDetail.taskValue}}分</p>
          <p>知识百科：</p>
          <p class="zs_content">{{taskDetail.content}}</p>
        </div>
        <div class="first819tk_footer">
          <div class="first819tk_footer_wrap">
            <div style="margin-right:25px">
              <y-button
                type="taskrest"
                :disabled="false"
                @handleClick="()=>dialogShow_task=false"
              >重接任务</y-button>
            </div>
            <div>
              <y-button
                type="taskok"
                :class="[isActivityEnd?'isActivityEnd':'']"
                :disabled="false"
                @handleClick="getTask"
              >去完成</y-button>
            </div>
          </div>
        </div>
        <div class="closeX" @click="dialogShow_task=false">
          <img src="../../../../assets/819/closeX.png" alt />
        </div>
      </div>
    </y-dialog>
  </div>
</template>
<script>
import { getUrlParam } from '@/utils/func'
import { mapActions, mapMutations } from 'vuex'
import storage from 'storejs'
import share from '../../../../utils/share'
import yDialog from '@/components/common/dialog'
import yButton from '@/components/common/yButton'
import serviceApi from '../../../../api/serviceAPI'
import mixin819 from '../../../../utils/mixin819'
import { Toast } from 'vant'
let l = Math.floor(Math.random() * (2 - 1 + 1)) + 1
export default {
  components: {
    yDialog,
    yButton
  },
  mixins: [mixin819],
  data () {
    return {
      random: Math.floor(Math.random() * (2 - 1 + 1)) + 1,
      starLastIndex: -1,
      isClickStar: false, // 选择难度标识 是不是点击了
      taskDiff: [
        { txt: '一', isClickStar: false },
        { txt: '二', isClickStar: false },
        { txt: '三', isClickStar: false },
        { txt: '四', isClickStar: false },
        { txt: '五', isClickStar: false }
      ], // 难度
      taskRandomBg: {
        color: l ? '#fff' : '#333',
        backgroundImage: `url(${require(`../../../../assets/819/getTask${l}_bg.png`)})`
      },
      isRepresent: 'Y', // Y 代表 N 不是代表
      dialogShow_task: false, // 任务 弹框
      dialogShow_task_select: false, // 任务难度选择
      taskArr: [], // 瓶子
      taskDetail: null, // 任务详情
      isActivityEnd: false, // 活动是否结束
      taskData: {
        totalValue: 0
      } // 我的分数
    }
  },
  created () {
    changeTitle('领取任务')
    this.isRepresent = storage.get('userInfoAMY') ? 'Y' : 'N'
    if (this.isRepresent !== 'Y') {
      // 如果为非代表用户，进入专区首页
      this.$router.push({
        path: '/'
      })
    }
    this.selectStar(0) // 默认选择1星
    this._getMyTask()
    // this._queryTaskInfoByDifficulty();
  },
  mounted () {
    //  c初始化819 时间
    this.init819Activity().then(res819 => {
      this.isActivityEnd = this.is_activity === 2
    })

    share({
      title: '纳凉先锋--领取任务',
      desc: '完成任务，获取奖励！',
      link: `${location.origin}${location.pathname}#/activity819`,
      imgUrl: 'https://imageysz.yxj.org.cn/1565599191731.png'
    })
    try {
      this.baoSaveReport({
        PageName: '819医师节活动-代表端',
        EventID: '1',
        ControlName: '819医师节活动-代表端',
        Description: '819医师节活动-代表端'
      })
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    ...mapMutations(['hideLoad', 'showNetLoad', 'hideNetLoad']),
    ...mapActions({
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    /**
     * 获取我的任务
     */
    _getMyTask () {
      this.taskData = {
        totalValue: 0
      }
      let params = {
        code: '2'
      }
      this.showNetLoad()
      serviceApi.resultRepresentationalInfo(params).then(res => {
        if (res.code !== 1) {
          //   Toast("网络繁忙");
          return
        }
        this.taskData = res.data
        this.hideLoad()
      })
    },
    /**
     * 点亮星星 选择难度
     */
    selectStar (index) {
      this.taskDiff = [
        { txt: '一', isClickStar: false },
        { txt: '二', isClickStar: false },
        { txt: '三', isClickStar: false },
        { txt: '四', isClickStar: false },
        { txt: '五', isClickStar: false }
      ]
      this.taskDiff[index].isClickStar = true
      this._queryTaskInfoByDifficulty(index + 1)
      console.log()
    },
    /**
     * 根据难度查询任务
     */
    _queryTaskInfoByDifficulty (taskDifficulty = 1) {
      this.taskArr = []
      this.showNetLoad()
      let params = {
        taskDifficulty: taskDifficulty
      }

      serviceApi.queryTaskInfoByDifficulty(params).then(res => {
        if (res.code !== 1) {
          //   Toast("网络繁忙");
          return
        }
        this.taskArr = res.data
        this.hideLoad()
        this.dialogShow_task_select = false
        console.log('根据难度查询任务')
      })
    },
    /**
     * 点击每个任务
     */
    showTask (item) {
      this.showNetLoad()
      let { id } = item
      console.log({ id }, 'id')
      this.taskDetail = null

      // 根据id查看详情
      serviceApi.queryTaskDesc({ id }).then(res => {
        console.log(res, '根据id查看详情')
        this.random = Math.floor(Math.random() * (2 - 1 + 1)) + 1
        this.taskDetail = res.data
        console.log(this.random, 'random')
        this.hideLoad()
        this.taskRandomBg.backgroundImage = `url(${require(`../../../../assets/819/getTask${this.random}_bg.png`)})`
        this.taskRandomBg.color = this.random === 2 ? '#fff' : '#333'
        this.dialogShow_task = true
      })
    },
    /**
     * 领取任务
     */
    getTask (item) {
      console.log(this.is_activity, '领取任务-is_activity')
      if (this.is_activity === 0) {
        Toast('活动未开始')
        return
      }
      if (this.is_activity === 2) {
        Toast('活动已结束')
        return
      }
      let taskType = this.taskDetail.taskType // 任务类型(0:绑定医生1:推送内容2:观看直播3:同期声文字提问)
      let { id, taskNo } = this.taskDetail

      console.log(this.taskDetail, '领取任务-taskDetail')

      let params = {
        taskId: id,
        taskNo
      }
      console.log(params, 'params')
      serviceApi.saveRepresentationalAndDetail(params).then(res => {
        console.log(res, 'res')
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
          query: { source: '819' }
        })
        this.dialogShow_task = false
      })
    },
    /**
     * 隐藏819弹框
     */
    hideDialogInfo () {
      this.dialogShow_info819 = false
    },
    /**
     * 隐藏选择弹框
     */
    hideDialogInfo_select () {
      this.dialogShow_task_select = false
    }
  }
}
</script>
<style lang="less" scoped>
.inlineb {
  display: inline-block;
}
.selectItem {
  width: 0.69rem;
  /* height: .4rem; */
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(211, 211, 211, 0.5);
  border-radius: 8px;
  font-size: 0.12rem;
  color: rgba(238, 159, 87, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px 0;
  margin-right: 0.1rem;
  margin-bottom: 0.15rem;
  &_0 {
    width: 0.69rem;
  }
  &_1 {
    width: 0.81rem;
  }
  &_2 {
    width: 0.9rem;
  }
  &_3 {
    width: 1.1rem;
  }
  &_4 {
    width: 1.41rem;
  }
  &_5 {
    width: 100%;
  }

  &_txt {
  }
  .star {
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: 5px;
    & > img {
      width: 0.14rem;
      height: 0.14rem;
      margin-right: 4px;
    }
  }
}
.y-button.y-button-taskrest {
  width: 0.88rem;
  height: 0.28rem;
  line-height: 0.28rem;
  border-radius: 0.04rem;
  background: #d2d2d2;
  border: none;
  color: #fff;
}
.y-button.y-button-taskok {
  width: 0.88rem;
  height: 0.28rem;
  line-height: 0.28rem;
  border-radius: 0.04rem;
  background: #5137e3;
  border: none;
  color: #fff;
}
.isActivityEnd {
  background: #ccc !important;
}
.activity819 {
  width: 100%;
  //   min-height: 100%;
  height: 100%;
  &_top {
    width: 100%;
    height: 2.2rem;
    & > img {
      height: 100%;
    }
  }
  &_con {
    height: 100%;
    // min-height: 100%;
    // background: url(../../../../assets/819/activity819_con.png) no-repeat
    //   no-repeat;
    // background-size: contain;
    background: #38b9d4;
    position: relative;
  }
  &Game {
    width: 2.7rem;
    height: 2.6rem;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    top: 0;
    background: url(../../../../assets/819/guidao.png) no-repeat no-repeat;
    background-size: 100% 100%;
  }
}
.task {
  position: absolute;
  width: 0.4rem;
  height: 0.42rem;
  &1 {
    top: 0;
    left: 0.25rem;
    background: url(../../../../assets/819/task1.png) no-repeat no-repeat;
    background-size: 100% 100%;
  }
  &2 {
    top: 0;
    left: 1.4rem;
    background: url(../../../../assets/819/task2.png) no-repeat no-repeat;
    background-size: 100% 100%;
  }
  &3 {
    top: 0.7rem;
    left: 2.4rem;
    background: url(../../../../assets/819/task3.png) no-repeat no-repeat;
    background-size: 100% 100%;
  }
  &4 {
    top: 1.7rem;
    left: 2.2rem;
    background: url(../../../../assets/819/task4.png) no-repeat no-repeat;
    background-size: 100% 100%;
  }
  &5 {
    width: 0.5rem;
    height: 0.52rem;
    top: 1.5rem;
    left: 1.2rem;
    background: url(../../../../assets/819/task5.png) no-repeat no-repeat;
    background-size: 100% 100%;
  }
  &6 {
    width: 0.5rem;
    height: 0.52rem;
    bottom: -10px;
    right: 2.2rem;
    background: url(../../../../assets/819/task6.png) no-repeat no-repeat;
    background-size: 100% 100%;
  }
}

.taskSelect {
  position: fixed;
  padding: 6px 8px 6px 5px;
  left: 0;
  top: 0.1rem;
  height: 32px;
  line-height: 20px;
  background: #90f6ff;
  border-radius: 0 16px 16px 0;
  color: #007b95;
  font-size: 0.12rem;
  z-index: 100;
}
.hdgz {
  width: 0.44rem;
  height: 0.44rem;
  position: fixed;
  right: 0.2rem;
  z-index: 6666;
  bottom: 20%;
  background: url(../../../../assets/icons/hdgz819.png) no-repeat 100%;
  background-size: contain;
}
.mytask_footer {
  width: 100%;

  padding: 0.1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  &_wrap {
    width: 3.35rem;
    margin: auto;
    height: 0.65rem;
    background: #fff;
    border-radius: 12px;
    padding: 0.1rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .taskBtn {
      width: 1.31rem;
      height: 0.39rem;
      background: url(../../../../assets/819/Btn_blue-wdrw.png) no-repeat
        no-repeat;
      background-size: contain;
      color: #49b8ff;
      line-height: 0.39rem;
      text-align: center;
      &.lqrw {
        width: 1.13rem;
        background: url(../../../../assets/819/Btn_blue-nlxfq.png) no-repeat
          no-repeat;
        background-size: contain;
      }
    }
  }
}
.taskSelectDia {
  width: 3.1rem;
  height: 2.46rem;
  position: absolute;
  z-index: 7777;
  left: 50%;
  transform: translate(-50%, 0);
  top: 20%;
  padding-top: 0.2rem;
  background: #fff;
  border-radius: 8px;
  &_tit {
    display: flex;
    justify-content: center;
    padding-bottom: 0.16rem;
    & > img {
      width: 0.52rem;
      height: 0.65rem;
    }
  }
  &_con {
    display: flex;
    flex-wrap: wrap;
    padding: 0 0.15rem;
  }
}
.first819tk {
  width: 2.57rem;
  height: 3.2rem;
  background-size: 100% 100%;
  position: absolute;
  z-index: 888;
  left: 50%;
  transform: translate(-50%, 0);
  top: 20%;
  padding-top: 0.2rem;
  &_desc {
    font-size: 0.13rem;
    margin-top: 0.3rem;
    text-align: left;
    padding: 0 0.3rem;
    line-height: 1.7;
    .p1,
    .p2,
    .p3 {
      font-size: 0.14rem;
    }
    .p2 img {
      width: 0.14rem;
      display: inline-block;
      margin-right: 5px;
    }
    .p3 {
      margin-bottom: 0.1rem;
    }
  }
  &_footer {
    position: absolute;
    bottom: 0.2rem;
    left: 50%;
    transform: translate(-50%, 0);
    &_wrap {
      width: 2rem;
      margin: 0 auto;
      border-radius: 12px;
      display: flex;
      align-items: center;
    }
  }
  .closeX {
    position: absolute;
    left: 50%;
    bottom: -70px;
    color: #fff;
    font-size: 16px;
    transform: translate(-50%, 0);
    & > img {
      width: 0.3rem;
    }
  }
  .zs_content {
    overflow: auto;
    height: 1rem;
    margin-top: 5px;
  }
}
</style>
