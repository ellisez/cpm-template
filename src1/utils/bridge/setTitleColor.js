export default function setTitleColor (red, green, blue) {
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
	          'setTitleColor'
	          , {
	            red: red,
        green: green,
        blue: blue
	          }
	          , function (responseData) {

	          }
	        )
  } else if (isIOS) {

    // window.location.href='setTitleColor://a.com?r=' + red + '&g=' + green + '&b=' + blue;

  } else {
        	console.log('pc')
  }
}
