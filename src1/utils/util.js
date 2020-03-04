const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 以下时间格式转换兼容安卓 ios 小程序   调用方法   util.formatTimes("2018-04-17 15:09:00", 'yyyy-MM-dd hh:mm:ss')  后面传入你想要的格式

const REGEX = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
/**
 * @function format time
 * @param val, format
 * @return {string}
 * @example
 *      <template>
 *          <div>
 *             <span>{{item.time | formatTime('yyyy/MM/dd hh:mm:ss')}}</span>
 *          </div>
 *       </template>
 *       import {formatTime} from '../../library/timeFormat'
 *       export default {
 *          filters: {formatTime}
 *       }
 */
export const formatTimes = (val, format) => {
  if (val) {
    /**
     * @instructions 如果不是时间戳格式，且含有字符 '-' 则将 '-' 替换成 '/' && 删除小数点及后面的数字
     * @reason 将 '-' 替换成 '/' && 删除小数点及后面的数字 的原因是safari浏览器仅支持 '/' 隔开的时间格式
     */
    if (val.toString().indexOf('-') > 0) {
      val = val.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/') // 将 '-' 替换成 '/'
      if (val.indexOf('.') != -1) {
        val = val.slice(0, val.indexOf('.')) // 删除小数点及后面的数字
      }
    }
    let date = new Date(val)
    date.setHours(date.getHours() + 8)
    const [whole, yy, MM, dd, hh, mm, ss] = date.toISOString().match(REGEX)
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const dates = new Date().getDate()
    if (format) {
      return format
        .replace('yyyy', yy)
        .replace('yy', yy.slice(2))
        .replace('MM', MM)
        .replace('dd', dd)
        .replace('hh', hh)
        .replace('mm', mm)
        .replace('ss', ss)
    } else {
      return [yy, MM, dd].join('-') + ' ' + [hh, mm, ss].join(':')
    }
  } else {
    return '--'
  }
}

export const time = function (fmt) {
  Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
      'M+': this.getMonth() + 1, // 月份
      'd+': this.getDate(), // 日
      'h+': this.getHours(), // 小时
      'm+': this.getMinutes(), // 分
      's+': this.getSeconds(), // 秒
      'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
      'S': this.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
    return fmt
  }
  return new Date(fmt)
}

/**
 * 时间计算函数
 *
 */

export default {
  formatTime: formatTime,
  formatTimes: formatTimes,
  time: time
}
