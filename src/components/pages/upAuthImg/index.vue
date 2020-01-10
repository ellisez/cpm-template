<template>
	<div >
		<div class="auth-upload ">
			<!-- <div class="auth-up-tip flex align-items-center clearfix">
				<p>请上传示例图片</p>
			</div>
			<div class="auth-up-sel">
				<select v-model="selectValue" @change="changeSelectValue">
					<option value="0">医护执业证照片页+个人信息页</option>
					<option value="1">工牌+身份证正面照片</option>
				</select>
			</div> -->
			<div class="auth-up-tip flex align-items-center clearfix">
				<p>图片示例</p>
			</div>
			<div class="auth-up-example">
				<div class="clearfix" v-show="selectValue == 0">
					<img src="../../../assets/images/wo_renzhen_a_01.jpg">
					<img src="../../../assets/images/wo_renzhen_a_02.jpg">
				</div>
				<div class="clearfix" v-show="selectValue == 1">
					<img src="../../../assets/images/wo_renzhen_b_01.jpg">
					<img src="../../../assets/images/wo_renzhen_b_02.png">
				</div>
			</div>
			<h5 class="auth-rule">
				 请确保姓名、职称、头像等信息清晰可见，上传资料仅用于认证，其他用户及第三方不可见
			</h5>
			<div class="img-priview">
		        <div class="privew-item">
		          	<div class="item-inner1 flex align-items-center justify-center"  @click="chooseImage(1)">
		          		<spinner v-show="statu1 == 0"></spinner>
		            	<i v-show="statu1 == 1">+</i>
		            	<img v-show="statu1 == 2" :src="imgData1"/>
		          	</div>
		        </div>
	        	<div class="privew-item flex align-items-center justify-center">
	          		<div class="item-inner2 flex align-items-center justify-center" @click="chooseImage(2)">
		          		<spinner v-show="statu2 == 0"></spinner>
		            	<i v-show="statu2 == 1">+</i>
		            	<img v-show="statu2 == 2"  :src="imgData2"/>
	          		</div>
	        	</div>
	        	<div class="input-group">
	        		<input type="file" @change="imgCrop" id="upLoad" accept="image/*" >
	        	</div>
	    	</div>
	    	<div class="img-tips">
		        <div class="img-tip1">
		            <div class="tips-inner" v-if="selectValue == 0">医护执业证照片页</div>
		            <div class="tips-inner" v-if="selectValue == 1">工牌</div>
		        </div>
		        <div class="img-tip2">
		          	<div class="tips-inner" v-if="selectValue == 0">个人信息页</div>
		          	<div class="tips-inner" v-if="selectValue == 1">身份证正面照</div>
		        </div>
	    	</div>
		     <button class="ft16"  size="large" type="default"  @click="back">提交确认</button>
		</div>
	</div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { Toast, Loading } from 'vant'
// import { baseUrl } from '../../interfaceUrl'
import storage from 'storejs'
// import app from '../../utils/bridge'
// import { checkSystem } from '../../utils/func'
/* import {Group,Selector} from 'vux' */
import { changeTitle } from '../../../utils/func'

export default {
  components: {
    spinner: Loading
  },
  mounted () {
    changeTitle('认证')
    this.hideLoad()
  },
  data () {
    return {
      selectValue: 0,
      active: '',
      imgData1: '',
      imgData2: '',
      statu1: 1,
      statu2: 1,
      filename1: '',
      filename2: '',
      fileUrl1: '',
      fileUrl2: ''
    }
  },
  computed: {
    ...mapGetters(['encrypt', 'user', 'isWechat']),
    system () {
      return this.$store.state.system
    },
    btnDisable () {
      return this.imgData1 == '' || this.imgData2 == ''
    }
  },
  methods: {
    ...mapMutations(['hideLoad', 'setUserInfo']),
    ...mapActions({
      uploadFile: 'content/uploadFile'
    }),
    changeSelectValue () {
      this.imgData1 = '',
      this.imgData2 = '',
      this.statu1 = 1
      this.statu2 = 1
    },
    async chooseImage (n) {
      var obj = document.getElementById('upLoad')
      var self = this
      self.active = n
      var u = navigator.userAgent
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
      if (!this.isWechat) {
        // 安卓app
        if (isAndroid && location.href.indexOf('appencrypt') != -1) {
          window.WebViewJavascriptBridge.callHandler(
			  	          'selectImage'
			  	          , {}
			  	          , function (responseData) {
							  let resData = JSON.parse(responseData)
							  let data = resData.image
							  let fileName = new Date().getTime() + '.png'
              self['statu' + self.active] = 0
              try {
                var res = self.uploadFile({ data, fileName })
                res.then(res => {
                  self['statu' + self.active] = 2
                  self['imgData' + self.active] = res.data.url

                  const amy = storage.get('amy') || {}
                  if (!amy.ypUser) {
                    amy.ypUser = {}
                  }
                  if (self.selectValue == '0') {
                    amy.badgePhotoUrl = ''
                    amy.idCardUrl = ''
                    if (self.active == 1) {
                      amy.healthCarePhotoUrl = res.data.url
                    } else {
                      amy.healthCarePersonalUrl = res.data.url
                    }
                  } else {
                    amy.healthCarePhotoUrl = ''
                    amy.healthCarePersonalUrl = ''
                    if (self.active == 1) {
                      amy.badgePhotoUrl = res.data.url
                    } else {
                      amy.idCardUrl = res.data.url
                    }
                  }
                  storage.set('amy', amy)
                })
              } catch (error) {
                Toast(error)
              }
						  })

          function connectWebViewJavascriptBridge (callback) {
						   	if (window.WebViewJavascriptBridge) {
						   		callback(WebViewJavascriptBridge)
						   	} else {
						   		document.addEventListener('WebViewJavascriptBridgeReady', function () { callback(WebViewJavascriptBridge) }, false)
						   	}
          }

					   connectWebViewJavascriptBridge(function (bridge) {
			           bridge.init(function (message, responseCallback) {
			               console.log('JS got a message', message)
			               var data = {
			                   'Javascript Responds': 'Wee!'
			               }
			               console.log('JS responding with', data)
			               responseCallback(data)
			           })
				   })

			           bridge.registerHandler('selectImage', function (data, responseCallback) {
			               this.text = ('data from Java: = ' + data)
			               var responseData = 'Javascript Says Right back aka!'
			               responseCallback(responseData)
			           })
        } else {
          obj.click()
        }
      } else if (obj) {
        obj.click()
      }
    },
    test (img) {
      self.text = img
    },
    async imgCrop () {
      var imgD = document.getElementById('crop-img')
      if (imgD) {
        document.body.removeChild(imgD)
      }
      var self = this
      var f = document.getElementById('upLoad').files[0]
      var filename = f.name
      if (this.active == 1) {
        this.filename1 = filename
      } else {
        this.filename2 = filename
      }
      var src = window.URL.createObjectURL(f)
      var size = f.size / 1024
      var natureSizeW, natureSizeH
      var img = new Image()
      img.src = src
      img.crossOrigin = 'Anonymous'
      img.onload = function () {
        var that = this
		            var w = that.width
		                var h = that.height
		                var scale = w / h
			            w = src.width || w
			            h = w / scale

        var c = document.createElement('canvas')
			            var ctx = c.getContext('2d')
        $(c).attr({
			                width: w,
			                height: h
			            })
				    ctx.drawImage(img, 0, 0, w, h)
				    var base64
				    switch (true) {
				    	case size < 200:
				    		base64 = c.toDataURL('image/jpeg', 1)
				    	break
				    	case size >= 200 && size < 1000:
				    		base64 = c.toDataURL('image/jpeg', 0.4)
				    	break
				    	case size >= 1000 && size < 2000:
				    		base64 = c.toDataURL('image/jpeg', 0.2)
				    	break
				    	case size >= 2000 && size < 5000:
				    		base64 = c.toDataURL('image/jpeg', 0.08)
				    	break
				    	case size >= 5000:
				    		base64 = c.toDataURL('image/jpeg', 0.05)
				    	break
				    }
				    self['statu' + self.active] = 0

        const data = base64.split(',')[1]
        const fileName = self['filename' + self.active]
        try {
          var res = self.uploadFile({ data, fileName })
          console.log(res)
          res.then(res => {
							  self['imgData' + self.active] = res.data.url
							  self['statu' + self.active] = 2

            const amy = storage.get('amy') || {}
	  						if (self.selectValue == '0') {
	  							amy.badgePhotoUrl = ''
	  							amy.idCardUrl = ''
	  							if (self.active == 1) {
	  								amy.healthCarePhotoUrl = res.data.url
	  							} else {
	  								amy.healthCarePersonalUrl = res.data.url
	  							}
	  						} else {
	  							amy.healthCarePhotoUrl = ''
	  							amy.healthCarePersonalUrl = ''
	  							if (self.active == 1) {
	  								amy.badgePhotoUrl = res.data.url
	  							} else {
	  								amy.idCardUrl = res.data.url
	  							}
	  						}
            storage.set('amy', amy)
          })
        } catch (error) {
          Toast(error)
        }
      }
    },
    back () {
      if (this.imgData1 == '' || this.imgData2 == '') {
		          Toast('请上传图片')
		          return
		        }
      const amy = storage.get('amy') || {}
      console.log(amy.ypUser)
	  			amy.upImgOver = true
      storage.set('amy', amy)
				  if (this.$route.query.from) {
	          this.$router.back()
				  } else {
					  this.$router.push('/setting')
				  }
    }
  }
}
</script>
<style lang="less" scoped>
	.clearfix {
	  *zoom: 1;
	}

	.fl{
	  float: left;
	}

	.clearfix:before,

	.clearfix:after {
	  display: table;
	  line-height: 0;
	  content: "";
	}
	.clearfix:after {
	  clear: both;
	}
	.auth-upload{
		padding: 0 10px;
	}
	.auth-up-tip{
		font-size: 16px;
		margin: 10px 0px;
		height: 24px;
		img{
			float:left;
			width: 20px;
			height: 20px;
			margin-top:2px;
			margin-right: 15px;
		}
		p {
			float:left;
			line-height: 24px;
			color:#333;
		}
	}
	.auth-up-sel{
		width: 100%;
		font-size: 16px;
		height: 0.5rem;
		line-height: 0.5rem;
		margin-bottom: 0.2rem;

		select{
			width: 100%;
			border: none;
			background-color: #ffffff;
			color: #666;
			height: 0.5rem;
			line-height: 0.5rem;
			padding: 0 5px;
		}
	}
	.auth-up-example{
		>div{
			width: 100%;
			background-color: #ffffff;
			img{
				width: 50%;
				display: inline-block;
				padding: 10px;
				box-sizing: border-box;
				float: left;
			}
		}
	}
	.auth-rule{
		background-color: #f1f1f1;
		text-align: left;
		font-size: 14px;
		padding: 10px;
		color:#666666;
		font-weight: normal;
	}
	.img-priview {
      overflow: hidden;
      .input-group {
        display: none;
      }
      .privew-item {
        float: left;
        width: 50%;
        height: 120px;
        margin-top: 10px;
        position: relative;
        .item-inner1 {
          width: 100px;
          height: 100px;
          border: 1px dashed #cab2b2;
          position: absolute;
          top: 0;
          right: 15px;
          i {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 98px;
            height: 98px;
            line-height: 98px;
            display: block;
            text-align: center;
			background-color: #ffffff;
            font-size: 70px;
            color: #cab2b2;
          }
          img {
            position: absolute;
            display: block;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100px;
            height: 100px;
          }
        }
        .item-inner2 {
          width: 100px;
          height: 100px;
          border: 1px dashed #cab2b2;
          position: absolute;
          top: 0;
          left: 15px;
          i {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
			width: 98px;
            height: 98px;
            line-height: 98px;
            display: block;
			background-color: #ffffff;
            text-align: center;
            font-size: 70px;
            color: #cab2b2;
          }
          img {
            position: absolute;
            display: block;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100px;
            height: 100px;
          }
        }
      }
    }
    .img-tips {
      overflow: hidden;
      width: 100%;
      font-size: 12px;
      .img-tip1 {
        width: 50%;
        float: left;
        position: relative;
        height: 30px;
        .tips-inner {
          position: absolute;
          top: 0;
          right: 15px;
          width: 100px;
          text-align: center;
        }
      }
      .img-tip2 {
        width: 50%;
        float: left;
        position: relative;
        height: 30px;
        .tips-inner {
          position: absolute;
          top: 0;
          left: 15px;
          width: 100px;
          text-align: center;
        }
      }
    }
	.ft16 {
    border: 0;
    height: 40px;
    border-radius: 20px;
    background:linear-gradient(315deg,rgba(32,42,161,1) 0%,rgba(75,50,228,1) 100%);
    box-shadow:-2px 2px 10px 0px rgba(74,49,227,0.5);
		width: 90%;
		margin:0.2rem auto 0;
		color:#ffffff;
	}
</style>
