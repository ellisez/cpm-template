import axios from 'axios'
import store from '../store'

class requstHelper {
  static fetch = (url, data, option = {}, showload) => {
    // console.log(`${process.env.VUE_APP_API_HOST}${url}`);
    // console.log('请求', data);
    const data1 = {
      url: `${process.env.VUE_APP_API_HOST}${url}`, // 请求地址
      headers: option.header ? option.header : {},
      method: option.method ? option.method : 'POST',
      dataType: option.dataType ? option.dataType : 'json'
    }
    if (option.method === 'GET') { // 如果是get请求  传入参数的字段一定要是params  如果是post请求则是叫data
      data1.params = data
    } else {
      data1.data = data
    }
    return new Promise((resovle, reject) => {
      if (showload) {
        store._mutations.showNetLoad[0]()
      }
      axios(data1).then((rep) => {
        // console.log('请求响应', rep);
        store._mutations.hideNetLoad[0]()
        const repData = rep.data
        // 发生错误的场合
        if (repData.code === 0) {
          const message = repData.message || repData.msg
          reject(message)
        } else {
          resovle(repData)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

export default requstHelper
