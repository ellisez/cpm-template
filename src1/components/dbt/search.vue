<template>
  <!-- v-if="type === '2'" -->
  <div class="searchWrap">
    <div class="searchTop" v-if="type === '2'" data-flex="main:justify cross:center">
      <div class="center">
        <Search v-model="title" :placeholder="placeTxt" />
      </div>
      <div class="right" @click="titleChange">
        <span class="search">搜索</span>
      </div>
      <!-- <div class="right" v-if="showBtn==='2'" @click="clear">
        <span>重置</span>
      </div>-->
    </div>
    <div class="secondSel" v-if="type === '2'" data-flex="main:justify cross:center">
      <div class="right">
        <p>
          合计
          <span style="color:#756FF4">{{docCount}}人</span>
        </p>
      </div>
      <div class="left">
        <positionSelect @close="selectEnd" :positionName="propName" />
      </div>
    </div>
    <div class="third" v-if="type === '3'" data-flex="main:justify cross:center">
      <div class="left">
        总计
        <span style="color:#756FF4">{{hosCount}}人</span>
      </div>
      <div class="right" @click="citySelect">
        <p>全国</p>
      </div>
      <div class="center" @click="hosCancel">
        <p>重置</p>
      </div>
    </div>
    <div class="content">
      <div v-if="type === '2'" class="doctor">
        <p class="noContent" v-if="doctor.length<1" style="width:100%;height:100%;"></p>
        <div
          class="docItem"
          v-for="(item,index) of doctor"
          :key="index"
          data-flex="main:justify cross:center"
        >
          <div class="left">
            <div class="name" data-flex="main:left cross:center">
              <img v-if="item.isBind === 1" src="src1/assets/iconD/important.png" />
              <img v-if="item.isBind !== 1" src="src1/assets/iconD/doctor.png" />
              <p>
                {{item.userName}} — {{item.departmentName}}
                <span
                  style="color:#999"
                  v-if="item.isBind === 1"
                >(已关联)</span>
              </p>
            </div>
            <div class="hospital">{{item.hospitalName}}</div>
          </div>
          <div class="center" v-if="item.isBind !== 1">
            <button class="bind" @click="bindDoctor(item)">关联医生</button>
          </div>
          <div @click="doctorDetail(item)" class="right">
            <img src="src1/assets/iconD/right.png" />
          </div>
        </div>
      </div>
      <div v-if="type === '3'" class="hospital">
        <p class="noContent" v-if="hospital.length<1" style="width:100%;height:100%;"></p>
        <div
          class="hosItem"
          @click="getDoctor(item)"
          v-for="(item,index) of hospital"
          :key="index"
          data-flex="main:justify cross:center"
        >
          <div class="num">
            <img src="src1/assets/iconD/hospital.png" />
          </div>
          <div class="name">{{item.marketHospital}}</div>
          <div class="inter">
            <p>{{item.count}}人</p>
          </div>
          <div class="img">
            <img src="src1/assets/iconD/right.png" />
          </div>
        </div>
      </div>
    </div>
    <div class="back" @click="backHospital" v-if="type==='2'">
      <img src="http://studioimage.yxj.org.cn/1545917400283.png" alt />
    </div>
    <citySelect v-if="isSelect" @sure="sure" @cancel="cancel"></citySelect>
    <backIndex v-if="type==='3'" />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import backIndex from '../common/backIndex'
import { Search } from 'vant'
import citySelect from './select/citySelect'
import serviceApi from '../../api/serviceAPI'
import storage from 'storejs'
import { changeTitle } from '../../utils/func'
import positionSelect from './select/positionSelect'

export default {
  data () {
    return {
      isSelect: false,
      type: '3',
      title: '',
      provinceName: '',
      cityName: '',
      positionName: '',
      hospitalName: '',
      doctor: [],
      hospital: [],
      hosCount: '',
      docCount: '',
      showBtn: '1',
      propName: ''
    }
  },
  mounted () {
    this.hideLoad()
    this.searchHospital()
  },
  created () {
    changeTitle('搜索')
  },
  methods: {
    ...mapMutations(['hideLoad']),

    // 获取医院列表
    async searchHospital () {
      const data = {
        title: this.title,
        provinceName: this.provinceName,
        cityName: this.cityName
      }
      console.log(data)
      try {
        const res = await serviceApi.searchHospital(data)
        this.hospital = res.data.list
        this.hosCount = res.data.count
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },

    // 输入内容搜索
    titleChange () {
      this.showBtn = '2'
      this.hosDoctor()
    },

    // 重置医院搜索
    hosCancel () {
      this.cityName = ''
      this.provinceName = ''
      this.searchHospital()
    },

    // 搜索按钮
    search () {},

    // 关联医生
    async bindDoctor (item) {
      const data = {
        inviteUid: storage('amyxy').userId,
        beInviteUid: item.userId
      }
      try {
        const res = await serviceApi.inviteSave(data)
        this.hosDoctor()
        console.log(res)
      } catch (error) {
        console.log(error)
      }
      console.log(item)
    },

    async hosDoctor () {
      const data = {
        hospitalName: this.hospitalName,
        title: this.title,
        positionName: this.positionName
      }
      try {
        const res = await serviceApi.hosDoctor(data)
        this.doctor = res.data
        this.docCount = res.data.length
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },

    // 回到医院列表
    backHospital () {
      this.title = ''
      this.positionName = ''
      this.type = '3'
      this.showBtn = '1'
    },

    // 切换到医生列表
    getDoctor (item) {
      this.hospitalName = item.marketHospital
      this.title = ''
      this.cityName = ''
      this.provinceName = ''
      this.hosDoctor()
      this.type = '2'
    },

    // 职称选择
    selectEnd (val) {
      if (val === '所有职称') {
        this.positionName = ''
        this.propName = '所有职称'
      } else {
        this.positionName = val
        this.propName = val
      }

      this.showBtn = '2'
      this.hosDoctor()
    },

    // 取消搜索查询
    clear () {
      this.title = ''
      this.provinceName = ''
      this.cityName = ''
      this.propName = '所有职称'
      this.positionName = ''
      this.showBtn = '1'
      if (this.type === '3') {
        this.searchHospital()
      } else {
        this.hosDoctor()
      }
    },

    // 打开城市选择弹窗
    citySelect () {
      this.isSelect = true
    },

    // 确认选择
    sure (arr) {
      if (arr[0] === '全部') {
        this.provinceName = ''
      } else {
        this.provinceName = arr[0]
      }
      if (arr[1] === '全部') {
        this.cityName = ''
      } else {
        this.cityName = arr[1]
      }
      this.searchHospital()
      this.isSelect = false
    },

    // 关闭选择弹窗
    cancel () {
      this.isSelect = false
    },

    // 到医生详情页
    doctorDetail (item) {
      this.$router.push({
        path: '/doctorDetailDBT',
        query: { userId: item.userId, isBind: item.isBind }
      })
    }
  },
  components: {
    citySelect,
    Search,
    backIndex,
    positionSelect
  },
  watch: {},
  computed: {
    placeTxt () {
      if (this.type === '2') {
        return '请输入医生姓名'
      } else {
        return '请输入医院名称'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.searchWrap {
  background: #fff;
  text-align: left;
  .hospital {
    .hosItem {
      font-size: 0.13rem;
      color: #4a4a4a;
      padding: 0.15rem 0;
      border-bottom: 1px solid rgba(153, 153, 153, 0.1);
      .num {
        width: 18%;
        img {
          width: 0.33rem;
          height: 0.33rem;
          margin: 0 auto;
        }
      }
      .name {
        width: 60%;
      }
      .inter {
        text-align: center;
        width: 20%;
        color: #9b9b9b;
        text-align: right;
      }
      .img {
        height: 100%;
        width: 8%;
        img {
          width: 0.1rem;
          height: 0.1rem;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }
  }
  .back {
    width: 0.6rem;
    height: 0.6rem;
    position: fixed;
    bottom: 1.3rem;
    right: 0.1rem;
  }
  .doctor {
    text-align: left;
    .docItem {
      align-items: center;
      font-size: 0.12rem;
      color: #4a4a4a;
      padding: 0.15rem 0 0.15rem 0.15rem;
      border-bottom: 1px solid rgba(153, 153, 153, 0.1);

      .left {
        width: 62%;
        .name {
          padding: 0.04rem 0;
          img {
            width: 0.33rem;
            height: 0.33rem;
            margin-right: 0.1rem;
          }
          p {
            color: #4a4a4a;
          }
        }
        .hospital {
          color: #9b9b9b;
        }
      }
      .center {
        width: 14%;
        .bind {
          border-radius: 15px;
          width: 0.7rem;
          height: 0.3rem;
          background: rgba(119, 127, 255, 1);
          border-radius: 15px;
          border: 0;
          color: #fff;
        }
      }
      .right {
        width: 10%;
        height: 100%;
        img {
          width: 0.1rem;
          height: 0.1rem;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          margin: auto;
        }
      }
    }
  }
  .content {
    // padding: 0 0.15rem;
    .article {
      .artItem {
        font-size: 0.14rem;
        color: #4a4a4a;
        padding: 0.15rem 0;
        border-bottom: 1px solid rgba(153, 153, 153, 0.1);
        .title {
          width: 80%;
        }
        .right {
          img {
            width: 0.2rem;
            height: 0.2rem;
            display: block;
          }
        }
      }
    }
  }
  .third {
    font-size: 0.13rem;
    border-bottom: 1px solid rgba(153, 153, 153, 0.1);
    border-top: 1px solid rgba(153, 153, 153, 0.1);
    height: 0.5rem;
    line-height: 0.5rem;
    .left {
      width: 33%;
      text-align: left;
      padding-left: 0.2rem;
      color: #9b9b9b;
    }
    .right {
      width: 33%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #9b9b9b;
      p {
        position: relative;
      }
      p::after {
        right: -0.2rem;
        top: 0.21rem;
        display: block;
        position: absolute;
        content: "";
        width: 0.1rem;
        height: 0.07rem;
        background: url("http://studioimage.yxj.org.cn/1542618784855.png")
          no-repeat center;
        background-size: 0.1rem 0.07rem;
      }
    }
    .center {
      width: 33%;
      // text-align: center;
      color: #9b9b9b;
      display: flex;
      justify-content: flex-end;
      padding-right: 0.2rem;
      p {
        display: block;
        width: 0.6rem;
        height: 0.26rem;
        border-radius: 0.06rem;
        border: 1px solid rgba(71, 49, 221, 1);
        line-height: 0.26rem;
        text-align: center;
        font-size: 0.12rem;
        color: rgba(71, 49, 221, 1);
      }
    }
  }
  .secondSel {
    height: 0.5rem;
    font-size: 0.14rem;
    color: #9b9b9b;
    border-bottom: 1px solid rgba(153, 153, 153, 0.1);
    border-top: 1px solid rgba(153, 153, 153, 0.1);
    .left {
      display: flex;
      justify-content: center;
      width: 50%;
    }
    .right {
      padding-left: 0.2rem;
      width: 50%;
      display: flex;
      justify-content: left;
      align-items: center;
      color: #9b9b9b;
    }
  }
  .searchTop {
    color: #9b9b9b;
    .search {
      color: rgb(25, 137, 250);
    }
    padding: 0.05rem 0;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
    /deep/ .van-search {
      padding-right: 0;
    }
    .center {
      font-size: 0.12rem;
      width: 80%;
      /deep/ .van-search__content {
        border-radius: 17px;
      }
    }
    .right {
      width: 20%;
      font-size: 0.14rem;
      text-align: center;
    }
  }
}
/deep/ .el-range-editor.is-active,
/deep/ .el-range-editor.is-active:hover,
/deep/ .el-select .el-input.is-focus .el-input__inner {
  background-color: #fff;
}
.noContent {
  position: fixed;
  left: 0;
  top: 0.5rem;
  background: url("src1/assets/imagesD/position.d53faac.png") no-repeat center;
  background-size: 1.5rem auto;
}
</style>
