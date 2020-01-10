import axios from 'axios'
import store from '../store'

class requstHelper {
	// 819 活动接口 连接本地， 由于后台没有测试环境。。。。。。。。。
	static fetch = (url, data, option = {}, showload, is819 = false) => {
	  console.log(is819, 'is819-----------------------')
	  // console.log(`${process.env.VUE_APP_API_HOST}${url}`);
	  // console.log('请求', data);
	  const data1 = {
	    url: is819 ? `${process.env.VUE_APP_API_HOST_DBT_819}${url}` : `${process.env.VUE_APP_API_HOST_DBT}${url}`, // 请求地址
	    // url: `${process.env.VUE_APP_API_HOST_DBT}${url}`, // 请求地址
	    headers: option.header ? option.header : {},
	    method: option.method ? option.method : 'POST',
	    dataType: option.dataType ? option.dataType : 'json'
	  }
	  if (option.method === 'GET') {
	    // 如果是get请求  传入参数的字段一定要是params  如果是post请求则是叫data
	    data1.params = data
	  } else {
	    data1.data = data
	  }
	  return new Promise((resolve, reject) => {
	    if (showload) {
	      store._mutations.showNetLoad[0]()
	    }
	    axios(data1)
	      .then((rep) => {
	        store._mutations.hideNetLoad[0]()
	        console.log('请求响应', rep)
	        const repData = rep.data
	        // 发生错误的场合
	        if (repData.code === 0) {
	          const message = repData.message || repData.msg
	          reject(message)
	        } else {
	          resolve(repData)
	        }
	      })
	      .catch((err) => {
	        reject(err)
	      })
	  })
	};
}

export default requstHelper
