
/**
 * ClassName: uuid
 * Description: 生成 随机
 * @author XuHongLi
 * @date 2018-07-24
 */

export default function createUuid () {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  console.log(uuid)
  return uuid
}
