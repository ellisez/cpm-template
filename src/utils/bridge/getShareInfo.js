export default function share (info) {
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
	          'setShareInfo'
	          , {
	            'title': info.title,
	            'brief': info.brief,
	            'shareUrl': info.shareUrl,
        'shareImg': info.shareImg
	          }
	          , function (responseData) {

	          }
	        )
  } else if (isIOS) {
    var url = location.href
    if (url.indexOf('appencrypt') != -1) {
      window.location.href = 'share://a.com?title=' + info.title + '&=&brief=' + info.brief + '&=&image=' + info.shareImg + '&=&url=' + info.shareUrl
    }
  } else {
        	console.log('pc')
  }
}
// 把分享信息传给qpp
