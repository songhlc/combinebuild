const { series, parallel } = require('gulp')
let cp = require('child_process')

// `clean` 函数并未被导出（export），因此被认为是私有任务（private task）。
// 它仍然可以被用在 `series()` 组合中。
function clean(cb) {
  // body omitted
  cb()
}

// `build` 函数被导出（export）了，因此它是一个公开任务（public task），并且可以被 `gulp` 命令直接调用。
// 它也仍然可以被用在 `series()` 组合中。
function build(fileitem) {
  return function (cb) {
    console.log('execute:cd '+ fileitem.path +' && yarn && yarn build')
    cp.exec('cd '+ fileitem.path +' && yarn && yarn build',function(err,stdout){
      if (err) {
        throw Error(err)
      } else {
        console.log(stdout);
        cb()
      }
    });
  }
}
// body omitted
var filePath = [
  {
    path: 'reactproject',
    output: 'build',
  },
  {
    path: 'vueproject',
    output: 'dist',
  },
]
exports.build = build
exports.default = series(clean, parallel(build(filePath[0]), build(filePath[1])))
