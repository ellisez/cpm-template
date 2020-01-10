<template>
  <div class="avatar-cropper">
    <div v-if="dataUrl" class="avatar-cropper-overlay">
      <div class="avatar-cropper-mark">
        <a href="javascript:;" class="avatar-cropper-close" @click="destroy">&times;</a>
      </div>
      <div class="avatar-cropper-container">
        <div class="avatar-cropper-image-container">
          <img ref="img" :src="dataUrl" alt @load.stop="createCropper" />
        </div>
        <div class="avatar-cropper-footer">
          <button class="avatar-cropper-btn" @click="destroy" v-text="labels.cancel">Cancel</button>
          <button class="avatar-cropper-btn" @click="submit" v-text="labels.submit">Submit</button>
        </div>
      </div>
    </div>
    <input ref="input" type="file" class="avatar-cropper-img-input" :accept="mimes" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { Dialog } from 'vant'
import storage from 'storejs'

export default {
  props: {
    trigger: {
      type: [String, Element],
      required: true
    },
    uploadHandler: {
      type: Function
    },
    uploadUrl: {
      type: String
    },
    uploadHeaders: {
      type: Object
    },
    imgUrl: {
      type: String
    },
    uploadFormName: {
      type: String,
      default: 'file'
    },
    uploadFormData: {
      type: Object,
      default () {
        return {}
      }
    },
    cropperOptions: {
      type: Object,
      default () {
        return {
          aspectRatio: 1,
          autoCropArea: 1,
          viewMode: 1,
          movable: false,
          zoomable: false
        }
      }
    },
    outputOptions: {
      type: Object,
      default () {
        return {
          width: 512,
          height: 512
        }
      }
    },
    outputMime: {
      type: String,
      default: 'image/jpeg'
    },
    outputQuality: {
      type: Number,
      default: 0.9
    },
    mimes: {
      type: String,
      default: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
    },
    labels: {
      type: Object,
      default () {
        return {
          submit: '提交',
          cancel: '取消'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['isAndroid'])
  },
  data () {
    return {
      cropper: undefined,
      dataUrl: undefined,
      filename: undefined
    }
  },
  methods: {
    ...mapMutations(['hideLoad', 'showNetLoad']),

    destroy () {
      this.cropper.destroy()
      this.$refs.input.value = ''
      this.dataUrl = undefined
    },
    submit () {
      this.$emit('submit')
      //   this.showNetLoad();
      if (this.uploadUrl) {
        this.uploadImage()
      } else if (this.uploadHandler) {
        this.uploadHandler(this.cropper)
      } else {
        this.$emit('error', 'No upload handler found.', 'user')
      }
      this.destroy()
    },
    pickImage () {
      // 当前环境是安卓APP
      if (this.isAndroid && location.href.indexOf('appencrypt') !== -1) {
        this.chooseImageAndroid()
      } else {
        this.$refs.input.click()
      }
    },
    // 安卓选择图片
    chooseImageAndroid () {
      window.WebViewJavascriptBridge.callHandler(
        'selectImage',
        {},
        async responseData => {
          this.$emit('hand', responseData)
          const resData = JSON.parse(responseData)
          const data = `data:image/jpeg;base64,${resData.image}`
          this.dataUrl = data
          this.$emit('hand', this.dataUrl)
          this.filename = '04.jpg'
        }
      )

      function connectWebViewJavascriptBridge (callback) {
        if (window.WebViewJavascriptBridge) {
          callback(WebViewJavascriptBridge)
        } else {
          document.addEventListener(
            'WebViewJavascriptBridgeReady',
            () => {
              callback(WebViewJavascriptBridge)
            },
            false
          )
        }
      }

      connectWebViewJavascriptBridge(bridge => {
        bridge.init((message, responseCallback) => {
          console.log('JS got a message', message)
          const data = {
            'Javascript Responds': 'Wee!'
          }
          console.log('JS responding with', data)
          responseCallback(data)
        })
      })

      bridge.registerHandler('selectImage', function register (
        data,
        responseCallback
      ) {
        this.text = `data from Java: = ${data}`
        const responseData = 'Javascript Says Right back aka!'
        responseCallback(responseData)
      })
    },
    createCropper () {
      this.cropper = new Cropper(this.$refs.img, this.cropperOptions)
    },
    uploadImage () {
      if (
        !storage.get(process.env.VUE_APP_STORAGE_NAME) ||
        (storage.get(process.env.VUE_APP_STORAGE_NAME) &&
          !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt)
      ) {
        Dialog.confirm({
          title: '提示',
          message: '未登录无法进行此操作！',
          confirmButtonText: '去登录',
          cancelButtonText: '再看看',
          showCancelButton: true
        })
          .then(() => {
            // on confirm
            this.$router.push({
              path: '/login'
            })
          })
          .catch(() => {
            // on cancel
          })
        return
      }
      this.hideLoad()
      this.cropper.getCroppedCanvas(this.outputOptions).toBlob(
        blob => {
          const form = new FormData()
          const xhr = new XMLHttpRequest()
          const data = Object.assign({}, this.uploadFormData)
          if (!blob.type) {
            blob.type = 'image/jpeg'
          }
          for (const key in data) {
            form.append(key, data[key])
          }

          form.append(this.uploadFormName, blob, this.filename)
          console.log(blob)

          this.$emit('uploading', form, xhr)

          xhr.open('POST', this.uploadUrl, true)

          for (const header in this.uploadHeaders) {
            xhr.setRequestHeader(header, this.uploadHeaders[header])
          }

          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              let response = ''
              try {
                response = JSON.parse(xhr.responseText)
              } catch (err) {
                response = xhr.responseText
              }
              this.$emit('completed', response, form, xhr)
              if ([200, 201, 204].indexOf(xhr.status) > -1) {
                this.$emit('uploaded', response, form, xhr)
                this.hideLoad()
              } else {
                this.$emit('error', 'Image upload fail.', 'upload', xhr)
              }
            }
          }
          xhr.send(form)
        },
        this.outputMime,
        this.outputQuality
      )
    }
  },
  mounted () {
    console.log(123465)
    // listen for click event on trigger
    const trigger =
      typeof this.trigger === 'object'
        ? this.trigger
        : document.querySelector(this.trigger)
    if (!trigger) {
      this.$emit('error', 'No avatar make trigger found.', 'user')
    } else {
      console.log(789)
      trigger.addEventListener('click', this.pickImage)
    }

    // listen for input file changes
    const fileInput = this.$refs.input
    fileInput.addEventListener('change', () => {
      if (fileInput.files != null && fileInput.files[0] != null) {
        const reader = new FileReader()
        reader.onload = e => {
          this.dataUrl = e.target.result
          console.log(e)
        }

        reader.readAsDataURL(fileInput.files[0])

        this.filename = fileInput.files[0].name || 'unknown'
        console.log(this.filename)
        this.$emit('changed', fileInput.files[0], reader)
      }
    })
  }
}
</script>

<style lang="less" scoped>
.avatar-cropper {
  .avatar-cropper-overlay {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
  }

  .avatar-cropper-img-input {
    display: none;
  }

  .avatar-cropper-close {
    float: right;
    padding: 20px;
    // font-size: 3rem;
    display: none;
    color: #fff;
    font-weight: 100;
    text-shadow: 0px 1px rgba(40, 40, 40, 0.3);
  }

  .avatar-cropper-mark {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  .avatar-cropper-container {
    background: #fff;
    z-index: 999;
    box-shadow: 1px 1px 5px rgba(100, 100, 100, 0.14);

    .avatar-cropper-image-container {
      position: relative;
      max-width: 400px;
      height: 300px;
    }
    img {
      max-width: 100%;
      height: 100%;
    }

    .avatar-cropper-footer {
      display: flex;
      align-items: stretch;
      align-content: stretch;
      justify-content: space-between;

      .avatar-cropper-btn {
        width: 50%;
        padding: 15px 0;
        cursor: pointer;
        border: none;
        background: transparent;
        outline: none;
        &:hover {
          background-color: #2aabd2;
          color: #fff;
        }
      }
    }
  }
}
</style>
