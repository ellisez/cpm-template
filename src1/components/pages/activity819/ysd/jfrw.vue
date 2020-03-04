<template>
  <div class="activity819 jfrw">
    <div class="jfrw_wrap">
      <div class="jfrw_con">
        <div class="jfrw_wrap_top">
          <img src="src1/assets/819/jfrw_top.png" alt />
        </div>
        <!-- 文章阅读 -->
        <div class="jfrw_item">
          <div class="jfrw_item-tit">文章阅读</div>
          <div class="jfrw_item-con">
            <div class="jfrw_item-Group">
              <div class="jfrw_item-Group_bg wenzhang1"></div>
              <div>
                <!--活动已结束 -->
                <y-button v-if="isActivityEnd" type="readWz_status" :disabled="true">
                  <span>{{readWz>=1 && dataList.wenzhang[0].isLingqu?'已领取':'领取'}}</span>
                </y-button>
                <y-button
                  v-else
                  type="readWz_status"
                  :disabled="readWz>=1 && dataList.wenzhang[0].isLingqu?true:readWz>=1?false:true"
                  @handleClick="lingqu('50','1',0)"
                >
                  <span>{{readWz>=1 && dataList.wenzhang[0].isLingqu?'已领取':'领取'}}</span>
                </y-button>
              </div>
            </div>
            <div :class="['gap',readWz>=1?'green':'']"></div>
            <div class="jfrw_item-Group">
              <div class="jfrw_item-Group_bg wenzhang2"></div>
              <div>
                <!--活动已结束 -->
                <y-button v-if="isActivityEnd" type="readWz_status" :disabled="true">
                  <span>{{readWz>=3 && dataList.wenzhang[1].isLingqu?'已领取':'领取'}}</span>
                </y-button>
                <y-button
                  v-else
                  type="readWz_status"
                  :disabled="readWz>=3 && dataList.wenzhang[1].isLingqu?true:readWz>=3?false:true"
                  @handleClick="lingqu('150','1',1)"
                >
                  <span>{{readWz>=3 && dataList.wenzhang[1].isLingqu?'已领取':'领取'}}</span>
                </y-button>
              </div>
            </div>
            <div :class="['gap',readWz>=3?'green':'']"></div>
            <div class="jfrw_item-Group">
              <div class="jfrw_item-Group_bg wenzhang3"></div>
              <div>
                <!--活动已结束 -->
                <y-button v-if="isActivityEnd" type="readWz_status" :disabled="true">
                  <span>{{readWz>=3 && dataList.wenzhang[2].isLingqu?'已领取':'领取'}}</span>
                </y-button>
                <y-button
                  v-else
                  type="readWz_status"
                  :disabled="readWz>=5 && dataList.wenzhang[2].isLingqu?true:readWz>=5?false:true"
                  @handleClick="lingqu('300','1',2)"
                >
                  <span>{{readWz>=5 && dataList.wenzhang[2].isLingqu?'已领取':'领取'}}</span>
                </y-button>
              </div>
            </div>
          </div>
        </div>
        <!-- 直播 -->
        <div class="jfrw_item">
          <div class="jfrw_item-tit">直播观看</div>
          <div class="jfrw_item-con">
            <div class="jfrw_item-Group">
              <div class="jfrw_item-Group_bg zhibo1"></div>
              <div>
                <y-button v-if="isActivityEnd" type="readWz_status" :disabled="true">
                  <span>{{readZb>=1 && dataList.zhibo[0].isLingqu?'已领取':'领取'}}</span>
                </y-button>
                <y-button
                  v-else
                  type="readWz_status"
                  :disabled="readZb>=1 && dataList.zhibo[0].isLingqu?true:readZb>=1?false:true"
                  @handleClick="lingqu('50','2',0)"
                >
                  <span>{{readZb>=1 && dataList.zhibo[0].isLingqu?'已领取':'领取'}}</span>
                </y-button>
              </div>
              <!-- <div class="btn">领取</div> -->
            </div>
            <div :class="['gap',readZb>=1?'green':'']"></div>

            <!-- <div class="gap"></div> -->
            <div class="jfrw_item-Group">
              <div class="jfrw_item-Group_bg zhibo2"></div>
              <div>
                <y-button v-if="isActivityEnd" type="readWz_status" :disabled="true">
                  <span>{{readZb>=2 && dataList.zhibo[1].isLingqu?'已领取':'领取'}}</span>
                </y-button>
                <y-button
                  v-else
                  type="readWz_status"
                  :disabled="readZb>=2 && dataList.zhibo[1].isLingqu?true:readZb>=2?false:true"
                  @handleClick="lingqu('150','2',1)"
                >
                  <span>{{readZb>=2 && dataList.zhibo[1].isLingqu?'已领取':'领取'}}</span>
                </y-button>
              </div>
            </div>
            <div :class="['gap',readZb>=2?'green':'']"></div>

            <!-- <div class="gap"></div> -->
            <div class="jfrw_item-Group">
              <div class="jfrw_item-Group_bg zhibo3"></div>
              <div>
                <y-button v-if="isActivityEnd" type="readWz_status" :disabled="true">
                  <span>{{readZb>=3 && dataList.zhibo[2].isLingqu?'已领取':'领取'}}</span>
                </y-button>
                <y-button
                  v-else
                  type="readWz_status"
                  :disabled="readZb>=3 && dataList.zhibo[2].isLingqu?true:readZb>=3?false:true"
                  @handleClick="lingqu('300','2',2)"
                >
                  <span>{{readZb>=1 && dataList.zhibo[2].isLingqu?'已领取':'领取'}}</span>
                </y-button>
              </div>
            </div>
          </div>
        </div>
        <!-- 活跃 -->
        <div class="jfrw_item">
          <div class="jfrw_item-tit">活跃签到</div>
          <div class="jfrw_item-con">
            <div class="jfrw_item-Group">
              <div class="jfrw_item-Group_bg huoyue1"></div>
              <div>
                <y-button v-if="isActivityEnd" type="readWz_status" :disabled="true">
                  <span>{{readQd>=1 && dataList.qiandao[0].isLingqu?'已领取':'领取'}}</span>
                </y-button>
                <y-button
                  v-else
                  type="readWz_status"
                  :disabled="readQd>=1 && dataList.qiandao[0].isLingqu?true:readQd>=1?false:true"
                  @handleClick="lingqu('50','3',0)"
                >
                  <span>{{readQd>=1 && dataList.qiandao[0].isLingqu?'已领取':'领取'}}</span>
                </y-button>
              </div>
            </div>
            <div :class="['gap',readQd>=1?'green':'']"></div>

            <!-- <div class="gap"></div> -->
            <div class="jfrw_item-Group">
              <div class="jfrw_item-Group_bg huoyue2"></div>
              <div>
                <y-button v-if="isActivityEnd" type="readWz_status" :disabled="true">
                  <span>{{readQd>=3 && dataList.qiandao[1].isLingqu?'已领取':'领取'}}</span>
                </y-button>
                <y-button
                  v-else
                  type="readWz_status"
                  :disabled="readQd>=3 && dataList.qiandao[1].isLingqu?true:readQd>=3?false:true"
                  @handleClick="lingqu('150','3',1)"
                >
                  <span>{{readQd>=3 && dataList.qiandao[1].isLingqu?'已领取':'领取'}}</span>
                </y-button>
              </div>
            </div>
            <div :class="['gap',readQd>=3?'green':'']"></div>

            <div class="jfrw_item-Group">
              <div class="jfrw_item-Group_bg huoyue3"></div>
              <div>
                <y-button v-if="isActivityEnd" type="readWz_status" :disabled="true">
                  <span>{{readQd>=5 && dataList.qiandao[2].isLingqu?'已领取':'领取'}}</span>
                </y-button>
                <y-button
                  v-else
                  type="readWz_status"
                  :disabled="readQd>=5 && dataList.qiandao[2].isLingqu?true:readQd>=5?false:true"
                  @handleClick="lingqu('300','3',2)"
                >
                  <span>{{readQd>=5 && dataList.qiandao[2].isLingqu?'已领取':'领取'}}</span>
                </y-button>
              </div>
            </div>
          </div>
        </div>
        <!-- end -->
        <!-- 翻转有惊喜 -->
        <div class="fz">
          <!-- {{isActivityEnd}} -->
          <img src="src1/assets/819/fzyjx.png" class="fz_img" @click="_is819uploadCount" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUrlParam } from '@/utils/func'
import { mapActions, mapMutations } from 'vuex'
import storage from 'storejs'
import share from '../../../../utils/share'
import mixin819 from '../../../../utils/mixin819'
import serviceApi from '../../../../core/serviceAPI'
import yButton from '@/components/common/yButton'
import { Toast } from 'vant'

export default {
  mixins: [mixin819],
  components: {
    yButton
  },
  data () {
    return {
      list: {},
      dataList: {
        wenzhang: [
          // 文章阅读
          { isLingqu: false },
          { isLingqu: false },
          { isLingqu: false }
        ],
        zhibo: [{ isLingqu: false }, { isLingqu: false }, { isLingqu: false }], // 直播观看
        qiandao: [{ isLingqu: false }, { isLingqu: false }, { isLingqu: false }] // 活跃签到
      },
      readWz: 0, // 阅读文章
      readZb: 0, // 直播观看
      readQd: 0, // 活跃签到
      isActivityEnd: false // 活动是否结束
    }
  },
  computed: {},
  created () {
    changeTitle('穿上白大褂，向医者致敬')
    this.isRepresent = storage.get('userInfoAMY') ? 'Y' : 'N'
    if (this.isRepresent !== 'N') {
      // 如果为非代表用户，进入专区首页
      this.$router.push({
        path: '/'
      })
    }
    // 初始化819
    this.init819Activity()
      .then(res => {
        console.log(res, '积分任务页面819')
        this.isActivityEnd = this.is_activity === 2
      })
      .catch(e => {
        console.log('初始化819shibai')
      })
    this.hideLoad()
    this._reportArticleCount()
    this._reportVideoCount()
    this._reportSignCount()
    this.getList()
  },
  mounted () {
    share({
      title: '8·19 医师节，彰显医者风采',
      desc: '敬畏生命，致敬医者',
      link: `${location.origin}${location.pathname}#/activity819ysd`,
      imgUrl: 'https://imageysz.yxj.org.cn/1565578562066.png'
    })
    try {
      this.baoSaveReport({
        PageName: '819医师节活动-积分任务页面',
        EventID: '1',
        ControlName: '',
        Description: '积分任务页面'
      })
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    /**
     * 获取列表
     */
    getList () {
      let params = {}
      let mock = {
        code: 1,
        data: [
          {
            areaCode: '',
            companyCode: '',
            custip: '',
            id: 5,
            sorce: 150,
            type: 1,
            userId: '385690212006642733'
          },
          {
            areaCode: '',
            companyCode: '',
            custip: '',
            id: 6,
            sorce: 150,
            type: 2,
            userId: '385690212006642733'
          },
          {
            areaCode: '',
            companyCode: '',
            custip: '',
            id: 7,
            sorce: 50,
            type: 3,
            userId: '385690212006642733'
          }
        ],
        encrypt: '',
        msg: 'success'
      }
      try {
        serviceApi.queryDoctorSorce(params).then(res => {
          this.list = res.data
          this.findBtnLingQuStatus(res.data)
          console.log(res, 'res')
        })
      } catch (e) {
        this.findBtnLingQuStatus([])
      }
    },
    /**
     * 查找有没有领取
     */
    async findBtnLingQuStatus (list) {
      if (list.length === 0) {
        this.dataList.wenzhang.map(item => (item.isLingqu = false)) // 文章积分是不是被领取
        this.dataList.zhibo.map(item => (item.isLingqu = false)) // 视频积分是不是被领取
        this.dataList.qiandao.map(item => (item.isLingqu = false)) // 活跃积分是不是被领取
        console.log(this.dataList, 'dataList')
        return false
      }
      let wenzhang = [] // 文章
      let zhibo = [] // 直播
      let qiandao = [] // 签到
      let r = list.forEach(item => {
        if (item.type === 1) {
          wenzhang.push(item)
        } else if (item.type === 2) {
          zhibo.push(item)
        } else {
          qiandao.push(item)
        }
      })
      wenzhang = this.sortA(wenzhang)
      zhibo = this.sortA(zhibo)
      qiandao = this.sortA(qiandao)
      await this.setCollected(wenzhang, this.dataList.wenzhang)
      await this.setCollected(zhibo, this.dataList.zhibo)
      await this.setCollected(qiandao, this.dataList.qiandao)
    },
    /**
     * // 设为已领取
     * @param {vueOtherData}
     * @param {vueData}
     */
    async setCollected (vueOtherData, vueData) {
      for (let i = 0; i < vueOtherData.length; i++) {
        // 设为已领取
        console.log(vueOtherData[i].sorce, 'this.dataList.wenzhang[i].sorce')
        if (vueOtherData[i].sorce === 50) {
          vueData[0].isLingqu = true
        }
        if (vueOtherData[i].sorce === 150) {
          vueData[1].isLingqu = true
        }
        if (vueOtherData[i].sorce === 300) {
          vueData[2].isLingqu = true
        }
      }

      //   for (let i = 0; i < vueOtherData.length; i++) {
      //     // 设为已领取
      //     console.log(vueOtherData[i].sorce, "this.dataList.wenzhang[i].sorce");
      //     if (vueOtherData[i].sorce === 50) {
      //       vueData[0].isLingqu = true;
      //     }
      //     if (vueOtherData[i].sorce === 150) {
      //       vueData[0].isLingqu = true;
      //       vueData[1].isLingqu = true;
      //     }
      //     if (vueOtherData[i].sorce === 300) {
      //       vueData[0].isLingqu = true;
      //       vueData[1].isLingqu = true;
      //       vueData[2].isLingqu = true;
      //     }
      //   }
    },
    /**
     * 排序
     */
    sortA (arr) {
      console.log(arr, 'arr')
      return arr.sort((a, b) => a.sorce - b.sorce)
    },
    /**
     * 领取
     * @param sorce 积分
     * @param type 类型（1.文章 2.视频 3.活动签到）
     */
    lingqu (sorce, type, index) {
      console.log('领取')
      let params = {
        sorce: sorce + '',
        type: type + ''
      }
      serviceApi
        .receiveSorce(params)
        .then(res => {
          // this.readWz = res.data.total;
          if (res.code === 0) {
            Toast('网络繁忙')
            return
          }
          Toast('领取成功')
          if (type + '' === '1') {
            this.dataList.wenzhang[index].isLingqu = true // 置灰
          } else if (type + '' === '2') {
            this.dataList.zhibo[index].isLingqu = true // 置灰
          } else {
            this.dataList.qiandao[index].isLingqu = true // 置灰
          }
          console.log(res, '领取')
        })
        .catch(e => {
          Toast('网络繁忙')
          if (type + '' === '1') {
            this.dataList.wenzhang[index].isLingqu = true // 置灰
          } else if (type + '' === '2') {
            this.dataList.zhibo[index].isLingqu = true // 置灰
          } else {
            this.dataList.qiandao[index].isLingqu = true // 置灰
          }
          console.log(this.dataList, ' this.dataList.wenzhang[index].isLingqu')
        })
    },
    // 判断活动详情页面还是风采页面
    // 状态判断：如果已提交照片并生成风采卡用户，则直接进入风采卡页面
    _is819uploadCount () {
      let params = {}

      serviceApi.is819uploadCount(params).then(res => {
        if (res.code === 0) {
          Toast('网络繁忙')
          return
        }
        if (res.data) {
          // 根据data判断； 如果为空就是活动详情页面，不为空就是风采卡页面
          this.$router.replace({
            path: '/style819',
            query: { ...res.data, type: 'old' }
          })
        } else {
          this.$router.replace({
            path: '/'
          })
        }
        console.log(res, '_is819uploadCount')
      })
    },
    /**
     * 文章阅读
     */
    _reportArticleCount () {
      let params = {}
      serviceApi
        .reportArticleCount(params)
        .then(res => {
          this.readWz = res.data.total
          //   this.readWz = 1;
          console.log(res, '文章阅读')
        })
        .catch(e => {
          console.log(e, '网络繁忙')
        })
    },
    /**
     * 医生节视频直播数
     */
    _reportVideoCount () {
      let params = {}
      serviceApi.reportVideoCount(params).then(res => {
        this.readZb = res.data.total
        // this.readZb = 2;
        console.log(res, '视频直播数')
      })
    },
    /**
     * 医生节签到次数
     */
    _reportSignCount () {
      let params = {}
      serviceApi.reportSignCount(params).then(res => {
        // this.readQd = 1;
        this.readQd = res.data.total

        console.log(res, '医生节签到次数')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.y-button[disabled] {
  background: #ccc !important;
}
.green {
  background: rgba(43, 67, 193, 1) !important;
}
.y-button.y-button-readWz_status {
  width: 0.47rem;
  height: 0.2rem;
  margin-top: 0.08rem;
  background: rgba(43, 67, 193, 1);
  border-radius: 0.1rem;
  color: #fff;
  text-align: center;
  font-size: 0.12rem;
  line-height: 0.2rem;
  &.disabled {
    background: #ccc;
  }
}
.jfrw {
  width: 100%;
  min-height: 100%;
  background: #fff;
  .fz {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
    & > img {
      width: 120px;
    }
  }
  &_item {
    width: 2.95rem;
    min-height: 1.22rem;
    background: #fff;
    margin: 0 auto 0.14rem auto;
    border-radius: 0.08rem;
    padding: 0.1rem;
    text-align: left;
    .gap {
      width: 100%;
      height: 2px;
      background: rgba(234, 238, 243, 1);
      margin-top: 0.22rem;
    }
    &-tit {
      font-size: 0.15rem;
      color: #222;
      font-weight: bold;
    }
    .btn {
      width: 0.47rem;
      height: 0.2rem;
      margin-top: 0.08rem;
      background: rgba(43, 67, 193, 1);
      border-radius: 0.1rem;
      color: #fff;
      text-align: center;
      font-size: 0.12rem;
      line-height: 0.2rem;
      &.disabled {
        background: #ccc;
      }
    }
    &-con {
      margin-top: 5px;
      display: flex;
    }
    .jfrw_item-Group {
      position: relative;
    }
    .icon {
      display: inline-block;
    }
    .wenzhangIcon {
      width: 0.1rem;
      height: 0.1rem;
      background: url(src1/assets/819/wenzhang_icon.png) no-repeat
        no-repeat;
      background-size: 100% 100%;
    }
    .jfrw_item-Group_bg {
      width: 0.47rem;
      height: 0.67rem;
    }
    .jfrw_item-Group_bg.wenzhang1 {
      background: url(src1/assets/819/wenzhang1.png) no-repeat no-repeat;
      background-size: 100% 100%;
    }
    .jfrw_item-Group_bg.wenzhang2 {
      background: url(src1/assets/819/wenzhang2.png) no-repeat no-repeat;
      background-size: 100% 100%;
    }
    .jfrw_item-Group_bg.wenzhang3 {
      background: url(src1/assets/819/wenzhang3.png) no-repeat no-repeat;
      background-size: 100% 100%;
    }
    .jfrw_item-Group_bg.zhibo1 {
      background: url(src1/assets/819/zhibo1.png) no-repeat no-repeat;
      background-size: 100% 100%;
    }
    .jfrw_item-Group_bg.zhibo2 {
      background: url(src1/assets/819/zhibo2.png) no-repeat no-repeat;
      background-size: 100% 100%;
    }
    .jfrw_item-Group_bg.zhibo3 {
      background: url(src1/assets/819/zhibo3.png) no-repeat no-repeat;
      background-size: 100% 100%;
    }
    .jfrw_item-Group_bg.huoyue1 {
      background: url(src1/assets/819/huoyue1.png) no-repeat no-repeat;
      background-size: 100% 100%;
    }
    .jfrw_item-Group_bg.huoyue2 {
      background: url(src1/assets/819/huoyue2.png) no-repeat no-repeat;
      background-size: 100% 100%;
    }
    .jfrw_item-Group_bg.huoyue3 {
      background: url(src1/assets/819/huoyue3.png) no-repeat no-repeat;
      background-size: 100% 100%;
    }
  }
  &_con {
    border-radius: 0.12rem;
    border: 3px dashed #fff;
  }
  &_wrap {
    width: 3.43rem;
    margin: 0 auto;
    min-height: 100%;
    padding: 8px 4px;
    //   height: 100%;
    background: linear-gradient(
      180deg,
      rgba(235, 0, 0, 1) 0%,
      rgba(255, 80, 0, 1) 100%
    );
    border-radius: 0.12rem;
    &_top {
      margin: 5px 5px 20px 10px;
    }
  }
  .fz_img {
    width: 120px;
    height: 24px;
  }
}
</style>
