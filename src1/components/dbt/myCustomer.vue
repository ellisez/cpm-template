<template>
  <div class="customerWrap">
    <div class="searchTop" data-flex="main:justify cross:center">
      <div class="center">
        <Search v-model="userName" placeholder="请输入医生姓名" />
      </div>
      <div @click="search" class="right">
        <span style="color: rgb(25, 137, 250);">搜索</span>
      </div>
      <!-- <div v-if="showBtn === '2'" @click="cancel" class="right">
        <span>重置</span>
      </div>-->
    </div>
    <div class="secondSel" data-flex="main:justify cross:center">
      <div class="left">
        <positionSelect @close="selectEnd" :positionName="propName" />
      </div>
      <div v-if="selecList.length>0" class="right" @click="hospitalSelect">
        <p>医院</p>
      </div>
    </div>

    <div class="customerList">
      <p class="noContent" v-if="customer.length<1" style="width:3rem;height:3rem"></p>
      <div
        class="item"
        v-for="(item,index) in customer"
        :key="index"
        data-flex="main:justify cross:center"
        @click="doctorDetail(item)"
      >
        <div class="left">
          <!-- <img v-if="item.attentionFlag === 1" src="../../assets/iconD/important.png"> -->
          <img src="src1/assets/iconD/doctor.png" />
        </div>
        <div class="center">
          <div class="name">{{item.userName}}</div>
          <div class="hospital">{{item.hospitalName}}</div>
        </div>
        <div class="right">
          <div class="department">{{item.departmentName}}</div>
        </div>
      </div>
    </div>
    <Popup v-model="showHos" position="bottom">
      <Picker
        show-toolbar
        :columns="selecList"
        @confirm="hospitalChange"
        @cancel="showHos = false"
      />
    </Popup>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { changeTitle } from '../../utils/func'
import { Search, Popup, Picker } from 'vant'
import serviceApi from '../../api/serviceAPI'
import positionSelect from './select/positionSelect'
export default {
  data () {
    return {
      showHos: false,
      customer: [],
      userName: '',
      positionName: '',
      hospitalName: '',
      hospitalList: [],
      selecList: [],
      propName: '',
      showBtn: '1' // 显示搜索或者重置按钮
    }
  },
  mounted () {
    this.hideLoad()
    this.getList()
    this.searchHospital()
  },
  created () {
    changeTitle('我的客户')
  },
  methods: {
    ...mapMutations(['hideLoad']),
    // 获取医生列表
    async getList () {
      const data = {
        title: this.userName,
        hospitalName: this.hospitalName,
        positionName: this.positionName
      }
      try {
        const res = await serviceApi.myCustomer(data)
        this.customer = res.data
      } catch (error) {
        console.log(error)
      }
    },
    search () {
      this.getList()
      this.showBtn = '2'
    },

    // 获取 负责医院列表
    async searchHospital () {
      const data = {
        title: '',
        provinceName: '',
        cityName: ''
      }
      console.log(data)
      try {
        const res = await serviceApi.searchHospital(data)
        this.hospitalList = res.data.list
        this.checkHosoital()
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },

    hospitalChange (val) {
      if (val == '所有医院') {
        this.hospitalName = ''
      } else {
        this.hospitalName = val
      }
      this.getList()
      this.showHos = false
      this.showBtn = '2'
    },

    // 取消筛选
    cancel () {
      this.positionName = ''
      this.hospitalName = ''
      this.userName = ''
      this.propName = '所有职称'
      this.showBtn = '1'
      this.getList()
    },

    // 选择医院
    hospitalSelect () {
      if (this.selecList.length < 1) {
        return
      }
      this.showHos = true
    },

    // 设置医院列表
    checkHosoital () {
      this.hospitalList.forEach(ele => {
        this.selecList.push(ele.marketHospital)
      })
      this.selecList.unshift('所有医院')
    },

    // 职称选择
    // 职称选择
    selectEnd (val) {
      if (val === '所有职称') {
        this.positionName = ''
        this.propName = '所有职称'
      } else {
        this.positionName = val
        this.propName = val
      }
      this.getList()
      this.showBtn = '2'
    },

    // 跳转医生详情页
    doctorDetail (item) {
      console.log(item)
      this.$router.push({
        path: '/doctorDetailDBT',
        query: {
          userId: item.userId,
          isBind: 1
        }
      })
    }
  },
  components: {
    Search,
    Popup,
    Picker,
    positionSelect
  }
}
</script>

<style lang="less" scoped>
.customerWrap {
  background: #fff;
}
.customerList {
  text-align: left;
  .item {
    border-bottom: 1px solid #eee;
    padding: 0.15rem 0.1rem;
    .center {
      width: 60%;
      .name {
        font-size: 0.14rem;
        color: #4a4a4a;
      }
      .hospital {
        font-size: 0.12rem;
        color: #9b9b9b;
      }
    }
    .right {
      width: 30%;
      text-align: center;
      .department {
        font-size: 0.1rem;
        color: #9b9b9b;
      }
    }
    .left {
      width: 15%;
      img {
        width: 0.33rem;
        height: 0.33rem;
      }
    }
  }
}

.searchTop {
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
    text-align: center;
    width: 20%;
    color: #666;
    font-size: 0.13rem;
  }
}
.secondSel {
  height: 100%;
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
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #9b9b9b;
    height: 100%;
    p {
      // position: relative;
      height: 100%;
      display: flex;
      align-items: center;
    }
    p::after {
      right: -70%;
      top: 41%;
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
}
/deep/ input::-webkit-input-placeholder {
  color: #9b9b9b;
}

/deep/ input:-moz-placeholder {
  color: #9b9b9b;
}

/deep/ input::-moz-placeholder {
  color: #9b9b9b;
}

/deep/ input:-ms-input-placeholder {
  color: #9b9b9b;
}
.noContent {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background: url("src1/assets/imagesD/position.d53faac.png") no-repeat center;
  background-size: 1.5rem auto;
}
</style>
