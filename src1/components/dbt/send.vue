<template>
  <div style="text-align:left;background:#fff;padding-bottom:.39rem;">
    <div class="searchTop" data-flex="main:justify cross:center">
      <div class="center">
        <Search v-model="userName" placeholder="请输入医生姓名"/>
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
        <positionSelect @close="selectEnd" :positionName="propName"/>
      </div>
      <div v-if="selecList.length>0" class="right" @click="hospitalSelect">
        <p>医院</p>
      </div>
    </div>
    <div class="customer">
      <div
        class="item"
        data-flex="main:justify cross:center"
        v-for="(item,index) in list"
        :key="index"
      >
        <div class="left">
          <el-checkbox v-model="item.checked"></el-checkbox>
        </div>
        <div class="center">
          <div class="name">{{item.userName}}</div>
          <div class="hospital">{{item.hospitalName}}</div>
        </div>
        <div class="right">{{ item.departmentName }}</div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="innerL">
          已选
          <span>{{checkNum}}</span> 名医生
        </div>
        <div class="innerR">
          <span @click="check" v-text="checkAll?'取消全选':'全选'"></span>
        </div>
      </div>
      <div class="right" :class="{'dis':checkNum === 0}" @click="share">批量发送</div>
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
import serviceApi from '../../api/serviceAPI'
import { Search, Popup, Picker } from 'vant'
import { Toast } from 'mint-ui'
import positionSelect from './select/positionSelect'
export default {
  data () {
    return {
      showHos: false,
      list: [],
      userName: '',
      item: {},
      beUserId: [],
      positionName: '',
      hospitalList: [],
      selecList: [],
      hospitalName: '',
      propName: '',
      showBtn: '1',
      loading: false
    }
  },
  created () {
    this.item.code = this.$route.query.code
    this.item.shareEncryptKey = this.$route.query.shareEncryptKey
    this.item.title = this.$route.query.title
    this.item.type = this.$route.query.type
    this.item.channel = this.$route.query.channel
    this.item.fieldName = this.$route.query.columnName || ''
    this.item.labelName = this.$route.query.labelName || ''
    changeTitle('批量推送')
  },
  mounted () {
    this.hideLoad()
    this.searchHospital()
    this.getDoctor()
  },
  methods: {
    ...mapMutations(['hideLoad']),
    // 获取列表
    async getDoctor () {
      const that = this
      const data = {
        title: that.userName,
        positionName: this.positionName,
        hospitalName: this.hospitalName
      }
      try {
        const res = await serviceApi.myCustomer(data)
        res.data.forEach(ele => {
          ele.checked = false
        })
        that.list = res.data
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },

    // 取消筛选
    cancel () {
      this.positionName = ''
      this.hospitalName = ''
      this.userName = ''
      this.propName = '所有职称'
      this.getDoctor()
      this.showBtn = '1'
    },

    // 医院选择结束
    hospitalChange (val) {
      if (val === '所有医院') {
        this.hospitalName = ''
      } else {
        this.hospitalName = val
      }
      this.showHos = false
      this.getDoctor()
      this.showBtn = '2'
    },

    // 搜索
    search () {
      this.getDoctor()
      this.showBtn = '2'
    },

    // checkHosoital
    checkHosoital () {
      this.hospitalList.forEach(ele => {
        this.selecList.push(ele.marketHospital)
      })
      this.selecList.unshift('所有医院')
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
      this.getDoctor()
      this.showBtn = '2'
    },

    async share () {
      if (this.loading) {
        return
      }
      this.loadign = true
      this.checkUser()
      if (this.beUserId.length <= 0) {
        return
      }
      const data = {
        toCode: this.item.code,
        channel: this.item.channel,
        shareEncryptKey: this.item.shareEncryptKey,
        title: this.item.title,
        type: this.item.type,
        beUserId: this.beUserId,
        fieldName: this.item.fieldName,
        labelName: this.item.labelName
      }
      try {
        const res = await serviceApi.share(data)
        Toast(`已成功推送${this.checkNum}条内容`)
        this.loading = false
        console.log(res)
      } catch (error) {
        console.log(error)
      }
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

    // 选择医院
    hospitalSelect () {
      this.showHos = true
    },

    checkUser () {
      const that = this
      this.list.forEach(ele => {
        if (ele.checked) {
          that.beUserId.push(ele.userId)
        }
      })
    },

    check () {
      if (this.checkAll) {
        this.list.forEach((ele, index) => {
          ele.checked = false
        })
      } else {
        this.list.forEach((ele, index) => {
          ele.checked = true
        })
      }
    }
  },
  computed: {
    checkAll () {
      for (let i = 0; i < this.list.length; i++) {
        if (!this.list[i].checked) {
          return false
        }
      }
      return true
    },
    checkNum () {
      let result = 0
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].checked) {
          result += 1
        }
      }
      return result
    }
  },
  components: {
    Toast,
    Search,
    Popup,
    Picker,
    positionSelect
  }
}
</script>

<style lang="less" scoped>
.bottom {
  height: 0.4rem;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 5;
  .left {
    background: #fff;
    width: 50%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .innerL {
      text-align: center;
      width: 50%;
      span {
        color: #d0021b;
      }
    }
    .innerR {
      width: 50%;
      text-align: center;
    }
  }
  .right {
    width: 50%;
    font-size: 0.12rem;
    color: #fff;
    background: #4d32e7;
    text-align: center;
    line-height: 0.4rem;
  }
  .dis {
    background-color: rgba(153, 153, 153, 1);
  }
}
.customer {
  // margin-bottom: 0.5rem;
  height: 100%;
  padding: 0 0.15rem;
  .item {
    padding: 0.15rem 0;
    border-bottom: 1px solid #eee;
    .left {
      width: 8%;
    }
    .center {
      width: 60%;
      .name {
        font-size: 0.14rem;
        color: #333;
        line-height: 0.24rem;
      }
      .hospital {
        font-size: 0.12rem;
        color: #9b9b9b;
        line-height: 0.18rem;
      }
    }
    .right {
      width: 25%;
      font-size: 0.1rem;
      color: #9b9b9b;
      text-align: center;
    }
  }
  /deep/ .el-checkbox__inner {
    width: 24px;
    height: 24px;
  }
  /deep/ .el-checkbox__inner::after {
    top: 4px;
    left: 7px;
    height: 10px;
    width: 5px;
  }
}
.searchTop {
  padding: 0.05rem 0;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
  color: #9b9b9b;
  /deep/ .van-search {
    padding-right: 0;
  }
  .center {
    width: 80%;
    /deep/ .van-search__content {
      border-radius: 17px;
    }
  }
  .right {
    width: 20%;
    text-align: center;
  }
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #4d32e7;
  border-color: #4d32e7;
}
/deep/ .el-checkbox__inner:hover {
  border-color: #4d32e7;
}
.secondSel {
  font-size: 0.14rem;
  height: 0.5rem;
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
    p {
      position: relative;
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
</style>
