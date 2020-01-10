export default function setTitle (title) {
  var u = navigator.userAgent
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

  var GetQueryString = function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return (r[2])
    return null
  }
  if (isAndroid) {
		  window.WebViewJavascriptBridge.callHandler(
	          'setTitle'
	          , {
	            'title': title
	          }
	          , function (responseData) {

	          }
    )
  } else if (isIOS) {
    console.log('pc')
    // window.location.href='setTitle://a.com?title='+ title;
  } else {
        	console.log('pc')
  }
}
