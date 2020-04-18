const { series, parallel } = require('gulp')
const copyfile = require('./copyfile').default
let cp = require('child_process')

// `clean` 函数并未被导出（export），因此被认为是私有任务（private task）。
// 它仍然可以被用在 `series()` 组合中。
function clean(cb) {
  // body omitted
  cb()
}
function copyfileTask(filePath) {
  return function (cb) {
    copyfile(filePath)
    cb()
  }
}

// `build` 函数被导出（export）了，因此它是一个公开任务（public task），并且可以被 `gulp` 命令直接调用。
// 它也仍然可以被用在 `series()` 组合中。
function build(fileitem) {
  return function (cb) {
    console.log('execute:cd ' + fileitem.path + ' && yarn && yarn build')
    cp.exec('cd ' + fileitem.path + ' && yarn && yarn build', function (
      err,
      stdout
    ) {
      if (err) {
        throw Error(err)
      } else {
        console.log(stdout)
        cb()
      }
    })
  }
}

exports.default = function (filePath) {
  // 清空目录-》各自编译-》把文件拷贝到根目录下的dist目录
  var params = filePath.map(function (fileItem) {
    return build(fileItem)
  })
  return series(clean, parallel.apply(null, params), copyfileTask(filePath))
}
