<template>
  <div class="cityWrap">
    <mt-popup
      :closeOnClickModal="false"
      v-model="popupVisible"
      style="width:100%"
      position="bottom"
    >
      <div class="popup-control" style="color: #1989fa;" data-flex="main:justify cross:center">
        <a @click="cancel">取消</a>
        <a @click="sure">确认</a>
      </div>
      <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import serviceApi from '../../../api/serviceAPI'

export default {
  data () {
    return {
      popupVisible: false,
      provinceList: [],
      provincCodeList: [],
      cityList: [],
      slots: [],
      cityCodeList: [],
      provinceName: '',
      cityName: '',
      selected: [],
      provinceId: '',
      province: []
    }
  },
  created () {
    this.slots = [
      {
        flex: 1,
        values: this.provinceList,
        className: 'slot1',
        textAlign: 'center'
      },
      {
        divider: true,
        content: '—',
        className: 'slot2'
      },
      {
        flex: 1,
        values: this.cityList,
        className: 'slot3',
        textAlign: 'center'
      }
    ]
  },
  mounted () {
    this.popupVisible = true
    this.getDistricts()
  },
  methods: {
    // 获取省
    async getDistricts () {
      const data = {
        parentId: 0,
        level: '1'
      }
      try {
        const districtsList = await serviceApi.getDistrict(data)
        const res = districtsList.data
        res.unshift({
          id: 'p',
          name: '全部'
        })
        this.province = res
        for (let i = 0; i < res.length; i++) {
          this.provinceList.push(res[i].name)
          this.provincCodeList.push(res[i].id)
        }
        this.provinceId = res[0].id
      } catch (error) {
        console.log(error)
      }
    },

    // 获取市
    async getCity (picker) {
      const data = {
        parentId: this.provinceId,
        level: '2'
      }
      try {
        const districtsList = await serviceApi.getDistrict(data)
        const res = districtsList.data
        this.cityList = []
        res.unshift({
          id: 'c',
          name: '全部'
        })
        for (let i = 0; i < res.length; i++) {
          this.cityList.push(res[i].name)
          this.cityCodeList.push(res[i].id)
        }
        picker.setSlotValues(1, this.cityList)
      } catch (error) {
        console.log(error)
      }
    },

    cancel () {
      this.$emit('cancel')
      this.popupVisible = false
    },
    sure () {
      this.$emit('sure', this.selected)
      this.popupVisible = false
    },
    onValuesChange (picker, values) {
      this.selected = values
      this.provinceName = values[0]
      this.cityName = values[1]
      const areaList = this.province
      for (let i = 0; i < areaList.length; i++) {
        if (areaList[i].name === values[0]) {
          this.provinceId = areaList[i].id
          this.getCity(picker)
        }
      }
    }
  },
  components: {}
}
</script>

<style lang="less" scoped>
.popup-control {
  background: #fff;
  border-bottom: 1px solid #f7f7f7;
  width: 100%;
  a {
    line-height: 0.24rem;
    display: block;
    margin: 8px 15px;
  }
}
/deep/ .picker-slot {
  font-size: 15px;
}
</style>
