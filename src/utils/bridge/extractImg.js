export default function extractImg (string) {
  const imgReg = /<img.*?(?:>|\/>)/gi
  const srcReg = /src=['"]?([^'"]*)['"]?/i
  const arr = string.match(imgReg)
  if (arr) {
    var addString = string.replace(/<img./gi, "$& class='prewiew-images'")
    var imgArr = string.match(imgReg).map(str => str.match(srcReg)[1])
    return {
      string: addString,
      urls: imgArr
    }
  } else {
    return {
      string: string,
      urls: []
    }
  }
}
