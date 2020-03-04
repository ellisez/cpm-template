<template>
  <div class="e-calendar-wrapper box">
    <div class="e-calendar">
      <div class="e-date-select">
        <div class="e-date-monthday">
          <div class="e-calendar-toolbar">
            <div @click="prevMonth">
              <img style="width:10px;height:15px" src="src1/assets/iconD/prev.png" />
            </div>
            <div :key="showDate.monthStr">
              <span>{{showDate.year}}年</span>
              <span>{{ showDate.month }}月</span>
            </div>
            <div @click="nextMonth">
              <img style="width:10px;height:15px" src="src1/assets/iconD/next.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="e-calendar-container">
        <div class="e-calendar-week">
          <span class="e-calendar-week-day double">日</span>
          <span class="e-calendar-week-day">一</span>
          <span class="e-calendar-week-day">二</span>
          <span class="e-calendar-week-day">三</span>
          <span class="e-calendar-week-day">四</span>
          <span class="e-calendar-week-day">五</span>
          <span class="e-calendar-week-day double">六</span>
        </div>
        <div class="e-calendar-monthday">
          <div :key="showDate.monthStr" class="e-calendar-monthday-wrapper">
            <div class="e-calendar-monthday-row" :key="index" v-for="(row,index) in rows">
              <span
                v-for="(day,index) in row"
                :key="index"
                class="e-calendar-monthday-row-day"
                @click="selectDay(day)"
                :class="{
                  'active': day.isToday,
                  'disabled': day.disabled,
                  'selected':day.selected,
                  'invited':day.invited,
                  'me':day.isMe
                }"
              >{{ day.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="icon" data-flex="main:justify cross:center">
      <div class="disable">
        <span>不可申请</span>
      </div>
      <div class="select">
        <span>选中状态</span>
      </div>
      <div class="able">可申请</div>
      <div class="invited">已被申请</div>
    </div>
    <div class="btnBox">
      <span class="btn" @click="applay" v-text="btnText"></span>
    </div>
    <div class="btnBox">
      <span class="info">友情提示：选中日期后，请点击下方申请按钮进行站位，三日内允许取消申请。</span>
    </div>
  </div>
</template>
<script>
import serviceApi from '../../../api/serviceAPI.js'
import { mapMutations, mapActions } from 'vuex'
import { Toast } from 'mint-ui'
import storage from 'storejs'
import { throws } from 'assert'
import { constants } from 'fs'

const weekJson = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  7: '星期日'
}
const monthJson = {
  1: '一月',
  2: '二月',
  3: '三月',
  4: '四月',
  5: '五月',
  6: '六月',
  7: '七月',
  8: '八月',
  9: '九月',
  10: '十月',
  11: '十一月',
  12: '十二月'
}
export default {
  name: 'DatePicker',
  props: {
    maxDate: {
      type: String,
      default: '5000-12-31'
    }
  },
  data () {
    return {
      btnText: '申请',
      usedNow: [],
      userId: storage('amyxy').userId,
      selectDate: {
        year: '',
        month: '',
        day: '',
        week: '',
        date: '',
        weekStr: '',
        monthStr: ''
      }, // 选择的时间，默认是用户传的date时间
      showDate: {
        year: '',
        month: '',
        day: '',
        week: '',
        date: '',
        monthStr: '',
        weekStr: ''
      },
      copyMinDate: {
        year: '',
        month: '',
        day: ''
      },
      copyMaxDate: {
        year: '',
        month: '',
        day: ''
      },
      date: '',
      minDate: '',
      oldMonth: 0,
      nowYear: '',
      nowMonth: '',
      nowDay: '',
      nowSelect: '',
      btnType: '1'
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    // 获取已经占用列表
    async getUse () {
      const data = {
        placeDate: `${this.showDate.year}-${this.keepDoubleDigit(
          this.showDate.month
        )}`
      }
      try {
        const res = await serviceApi.getDate(data)
        this.usedNow = res.data
        this.hideLoad()
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },

    // 申请会议
    async applayMeeting () {
      const data = {
        placeDate: `${this.selectDate.year}-${this.keepDoubleDigit(
          this.selectDate.month
        )}-${this.keepDoubleDigit(this.selectDate.day)}`
      }
      try {
        const res = await serviceApi.applayMeeting(data)

        this.getUse()
        if (res.code === 1) {
          this.btnType = '2'
          this.btnText = '取消申请'
        }
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },

    // 取消申请
    async cancle () {
      const data = {
        code: this.nowSelect.code
      }
      console.log(data)
      try {
        const res = await serviceApi.cancleMeeting(data)
        if (res.code === 1) {
          this.btnType = '1'
          this.btnText = '申请'
        }
        this.getUse()
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },

    // 点击申请按钮
    applay () {
      if (
        !this.selectDate.day ||
        !this.selectDate.year ||
        !this.selectDate.month
      ) {
        Toast('请选择申请日期')
        return
      }
      if (this.btnType === '3') {
        return
      }
      if (this.btnType === '1') {
        this.applayMeeting()
      } else {
        this.cancle()
      }
    },

    // 初始化日历
    initDatePicker () {
      this.showDate = { ...this.splitDate(this.date, true) }
      this.oldMonth = new Date(
        this.showDate.year,
        this.showDate.month - 1,
        0
      ).getDate() // 上个月有几天
      this.copyMinDate = { ...this.splitDate(this.minDate) }
      this.copyMaxDate = { ...this.splitDate(this.maxDate) }
    },

    // 获取时间
    getTime () {
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },

    // 格式化时间
    splitDate (date, addStr) {
      let result = {}
      const splitValue = date.split('-')
      try {
        if (!splitValue || splitValue.length < 3) {
          throw new Error('时间格式不正确')
        }
        result = {
          year: Number(splitValue[0]),
          month: Number(splitValue[1]),
          day: Number(splitValue[2])
        }
        if (addStr) {
          result.week =
            new Date(result.year, result.month - 1, result.day).getDay() + 1
          result.monthStr = monthJson[result.month]
          result.weekStr = weekJson[result.week - 1]
        }
      } catch (error) {
        console.error(error)
      }
      return result
    },

    // 补齐每个月前面和后面空白
    addRowEmptyValue (row, count, isNew) {
      for (let i = 0; i < count - 1; i++) {
        row.push({
          value: '',
          month: this.showDate.month
        })
      }
    },

    // 每个月时间
    addRowDayValue (row, i) {
      const value = { value: i }
      const { day, month, year } = this.selectDate
      const showDate = this.showDate
      // 判断已经选择的
      if (year === showDate.year && month === showDate.month && day === i) {
        value.selected = true
      }
      // 当日期在最小值之外，禁止点击
      if (this.isMinLimitMonth() && i < this.copyMinDate.day) {
        value.disabled = true
      }
      // 当日期在最大值之外，禁止点击
      if (this.isMaxLimitMonth() && i > this.copyMinDate.day) {
        value.disabled = true
      }
      value.month = this.showDate.month
      row.push(value)
      for (let i = 0; i < row.length; i++) {
        if (i !== 3) {
          row[i].disabled = true
        }
      }
    },

    /**
     * 切换到上一个月
     */
    prevMonth () {
      // 如何当前月份已经小于等于minMonth 就不让其在执行
      if (this.isMinLimitMonth()) {
        return
      }
      const { year, month } = this.showDate
      // 判断当前月份，如果已经等于1（1就是一月，而不是二月）
      if (month <= 1) {
        this.showDate.year = year - 1
        this.showDate.month = 12
      } else {
        this.showDate.month -= 1
      }
      this.oldMonth = new Date(
        this.showDate.year,
        this.showDate.month - 1,
        0
      ).getDate() // 上个月有几天
      this.getUse()
    },

    /**
     * 切换到下一个月
     */
    nextMonth () {
      // 如何当前月份已经大于等于maxMonth 就不让其在执行
      if (this.isMaxLimitMonth()) {
        return
      }
      const { year, month } = this.showDate
      // 判断当前月份，如果已经等于12（12就是十二月）
      if (month >= 12) {
        this.showDate.year = year + 1
        this.showDate.month = 1
      } else {
        this.showDate.month += 1
      }
      this.oldMonth = new Date(
        this.showDate.year,
        this.showDate.month - 1,
        0
      ).getDate() // 上个月有几天
      this.getUse()
    },

    // 切换选中对象
    resetSelectDate (dayValue) {
      this.selectDate = { ...this.showDate }
      this.selectDate.day = dayValue
      this.selectDate.week =
        new Date(
          this.showDate.year,
          this.showDate.month - 1,
          dayValue
        ).getDay() + 1
      this.selectDate.weekStr = weekJson[this.selectDate.week - 1]
    },

    // 点击选中每天
    selectDay (day) {
      console.log(day, '--------------------------------------------day')
      this.nowSelect = day
      if (
        day.invited &&
        day.isMe &&
        day.createTime &&
        Number(day.createTime.split('-')[0]) === Number(this.nowYear) &&
        Number(this.keepDoubleDigit(day.createTime.split('-')[1])) ===
          Number(this.nowMonth) &&
        Number(day.createTime.split('-')[2]) <= Number(this.nowDay) &&
        Number(this.nowDay) <= Number(day.createTime.split('-')[2]) + 3
      ) {
        this.btnText = '取消申请'
        this.btnType = '2'
      } else if (day.invited || day.disabled) {
        this.btnText = '已占用'
        this.btnType = '3'
      } else {
        this.btnText = '申请'
        this.btnType = '1'
      }
      this.resetSelectDate(day.value)
    },

    // 最小值
    isMinLimitMonth () {
      return (
        this.showDate.year <= this.copyMinDate.year &&
        this.showDate.month <= this.copyMinDate.month
      )
    },

    // 最大值
    isMaxLimitMonth () {
      return (
        this.showDate.year >= this.copyMaxDate.year &&
        this.showDate.month >= this.copyMaxDate.month
      )
    },

    // 保持两位数
    keepDoubleDigit (number) {
      return number > 9 ? number : `0${number}`
    }
  },
  created () {
    // this.userId = storage(`${companyCode}||${areaCode}`).userId; // 区域号
    this.minDate = this.getTime()
    this.date = this.getTime()
    this.nowYear = new Date().getFullYear()
    this.nowMonth = this.keepDoubleDigit(new Date().getMonth() + 1)
    console.log(Number(this.nowMonth), '33333333333333333333')
    this.nowDay = new Date().getDate()
    this.initDatePicker()
    this.getUse()
  },

  computed: {
    yearList () {
      const result = []
      for (let i = this.copyMinDate.year; i <= this.copyMaxDate.year; i += 1) {
        result.push(i)
      }
      return result
    },
    title () {
      // calendar 上面的所有 title 信息包括二部分
      return {
        year: '',
        monthday: ''
      }
    },
    rows () {
      const { year, month } = this.showDate
      const months = new Date(year, month, 0).getDate() // 这个月有几天
      const result = []
      let row = []
      let weekValue

      for (let i = 1; i <= months; i += 1) {
        weekValue = new Date(year, month - 1, i).getDay() + 1
        if (i === 1 && weekValue !== 1) {
          this.addRowEmptyValue(row, weekValue, false)
          this.addRowDayValue(row, i)
        } else {
          this.addRowDayValue(row, i)
          if (i === months && weekValue !== 7) {
            this.addRowEmptyValue(row, 7 - weekValue + 1, true)
          }
        }
        // 按照一周分组
        if (weekValue % 7 === 0 || i === months) {
          result.push(row)
          row = []
        }
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.showDate.monthStr = monthJson[this.showDate.month]
      result.forEach(ele => {
        ele.forEach(item => {
          if (!item.value) {
            item.disabled = false
          }
        })
      })

      result.forEach(ele => {
        ele.forEach(item => {
          this.usedNow.forEach(useItem => {
            if (
              this.keepDoubleDigit(item.value) ==
                useItem.placeDate.split('-')[2] &&
              useItem.userId === this.userId
            ) {
              item.invited = true
              item.isMe = true
              item.code = useItem.code
              item.createTime = useItem.createTime.split(' ')[0]
            } else if (
              this.keepDoubleDigit(item.value) ==
                useItem.placeDate.split('-')[2] &&
              !item.isPrev &&
              !item.isNext
            ) {
              item.invited = true
              item.code = useItem.code
              item.createTime = useItem.createTime.split(' ')[0]
            }
          })
        })
      })

      result.forEach(ele => {
        ele.forEach(item => {
          if (item.month == Number(this.nowMonth) && item.value) {
            item.disabled = true
          }
        })
      })
      return result
    }
  },
  components: {
    Toast
  }
}
</script>

<style lang="less" scoped>
.box {
  font-size: 12px;
}
.btnBox {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.4rem;
  .btn {
    color: #716ff3;
    line-height: 0.4rem;
    text-align: center;
    width: 90%;
    height: 0.4rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 4px;
    font-size: 0.14rem;
  }
  .info {
    color: #716ff3;
    text-align: center;
    width: 90%;
    font-size: 0.14rem;
    color: rgba(255, 255, 255, 1);
    line-height: 20px;
  }
}
.e- {
  &calendar-wrapper {
    width: 100%;
    min-height: 100%;
    background: linear-gradient(
      180deg,
      rgba(74, 50, 226, 1) 0%,
      rgba(35, 42, 166, 1) 100%
    );
  }
  &calendar {
    // background-color: #ffffff;
    width: 100%;
  }
  &date-select {
    background: rgba(74, 50, 226, 1);
    padding: 12px 20px;
    color: #fff;
    font-weight: 500;
    text-align: center;
  }
  &date-year {
    font-size: 0.16rem;
    padding-bottom: 4px;
    position: relative;
    width: 66px;
    height: 25px;
    overflow: hidden;
    &-select {
      position: absolute;
      opacity: 0.7;
      &.active {
        opacity: 1;
      }
    }
  }
  &date-monthday {
    font-size: 18px;
    position: relative;
    line-height: 60px;
    width: 100%;
    height: 60px;
    overflow: hidden;
    &-select {
      position: absolute;
      opacity: 0.7;
      text-align: center;
      width: 100%;
      &.active {
        opacity: 1;
      }
    }
  }
  &calendar-container {
    width: 90%;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 6px;
    padding: 30px 0;
  }
  &calendar-toolbar {
    margin: 5px 10px 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-title {
      position: relative;
      width: 100px;
      height: 22px;
      text-align: center;
      &-content {
        position: absolute;
        width: 100%;
        font-size: 16px;
      }
    }
  }
  &calendar-svg {
    padding: 8px;
    position: relative;
    height: 40px;
    width: 40px;
    &-icon {
      display: block;
      fill: currentColor;
      height: 24px;
      width: 24px;
      user-select: none;
      position: relative;
      z-index: 2;
    }
    &-cover {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      background-color: #e0e0e0;
      border-radius: 50%;
      opacity: 0;
      display: inline-block;
    }
  }
  &calendar-week {
    width: 100%;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.87);
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 16px;
    &-day {
      flex: 1;
      text-align: center;
    }
  }
  &calendar-monthday {
    color: #9b9b9b;
    padding-top: 10px;
    font-size: 14px;
    position: relative;
    width: 100%;
    min-height: 232px;
    overflow: hidden;
    &-wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    &-row {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1px 2px;
      &-day {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        position: relative;
        height: 35px;
        &.pointer {
          cursor: pointer;
        }
        &-value {
          position: relative;
          z-index: 1;
          font-size: 0.14rem;
          color: #666;
        }
        &-cover {
          width: 30px;
          height: 30px;
          // background-color: #f2f2f2;
          position: absolute;
          left: 10px;
          top: 2px;
          transform: translate3d(0, 0, 0);
          z-index: 0;
          border-radius: 50%;
          opacity: 1;
          display: block;
        }
        &.disabled {
          cursor: not-allowed;

          background: url("src1/assets/iconD/lock.png") no-repeat center
            center;
          background-size: 26px 26px;
          text-align: center;
        }
        &.invited {
          background-image: url("src1/assets/iconD/invited.png");
          background-size: 35px 35px;
          background-repeat: no-repeat;
          background-position: center;
        }
        &.selected {
          background-color: #ffb288;
        }
        &.me::after {
          display: block;
          content: "我";
          width: 18px;
          height: 18px;
          background-color: #fff;
          position: absolute;
          left: 0.28rem;
          top: 0.05rem;
          transform: translate3d(0, 0, 0);
          font-size: 8px;
          border-radius: 50%;
          text-align: center;
          line-height: 18px;
          opacity: 1;
          display: block;
          z-index: 10;
        }
        &.disabled .lock {
          display: block;
          content: "";
          position: absolute;
          left: 11px;
          top: 5px;
          width: 26px;
          height: 26px;
          opacity: 0.8;
        }
      }
    }
  }
  &calendar-actions {
    padding: 0 20px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .btn {
      color: #ffb288;
      margin-left: 40px;
      font-size: 16px;
      background-color: transparent;
    }
  }
}
.e_calendar_day-enter {
  opacity: 0;
}
.e_calendar_day-enter {
  width: 0;
  height: 0;
  transform: translate3d(12px, 12px, 0);
}
.double {
  color: #ff6699;
}
.icon {
  height: 0.4rem;
  line-height: 0.4rem;
  background: rgba(255, 255, 255, 0.7);
  width: 90%;
  margin: 0 auto;
  margin-top: 0.4rem;
  border-radius: 4px;
  .disable {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .disable::before {
    width: 0.2rem;
    height: 0.2rem;
    background: url("src1/assets/iconD/lock.png") no-repeat center;
    background-size: 0.2rem 0.2rem;
    margin-right: 0.05rem;
    display: block;
    content: "";
  }
  .select {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .select::before {
    width: 0.15rem;
    height: 0.15rem;
    margin-right: 0.05rem;
    background: #ffb288;
    // border-radius: 50%;
    display: block;
    content: "";
  }
  .able {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .able::before {
    width: 0.15rem;
    height: 0.15rem;
    margin-right: 0.05rem;
    background: #f2f2f2;
    // border-radius: 50%;
    display: block;
    content: "";
  }
  .invited {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .invited::before {
    width: 0.15rem;
    height: 0.15rem;
    margin-right: 0.05rem;
    background: #716ff3;
    // border-radius: 50%;
    display: block;
    content: "";
  }
}
</style>
