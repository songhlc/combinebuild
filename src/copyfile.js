const fs = require('fs')
const path = require('path')
var stat = fs.stat
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function (src, dst, callback) {
  fs.exists(dst, function (exists) {
    // 已存在
    if (exists) {
      callback(src, dst)
    }
    // 不存在
    else {
      fs.mkdir(dst, function () {
        callback(src, dst)
      })
    }
  })
}
var copy = function (src, dst) {
  // 读取目录中的所有文件/目录
  fs.readdir(src, function (err, paths) {
    if (err) {
      throw err
    }

    paths.forEach(function (path) {
      var _src = src + '/' + path,
        _dst = dst + '/' + path,
        readable,
        writable

      stat(_src, function (err, st) {
        if (err) {
          throw err
        }

        // 判断是否为文件
        if (st.isFile()) {
          try {
            // 创建读取流
            // readable = fs.createReadStream(_src)
            // // 创建写入流
            // writable = fs.createWriteStream(_dst)
            // // 通过管道来传输流
            // fs.writeFile(_dst,'',function(err){
            //   if(err) throw new Error('something wrong was happended');
            // })
            // readable.pipe(writable)
            fs.readFile(_src, function (err, data) {
              if (err) throw new Error('something wrong read was happended')
              fs.writeFile(_dst, data, function (err) {
                if (err)
                  throw new Error(_dst + ' something wrong write was happended') 
              })
            })
          } catch (e) {
            console.log('error: ' + _src, _dst)
          }
        }
        // 如果是目录则递归调用自身
        else if (st.isDirectory()) {
          exists(_src, _dst, copy)
        }
      })
    })
  })
}
// try {
//   exists('./lib', '../umidemo/node_modules/nm-viewmodel/lib', copy)
//   exists('./lib', '../classcomponent/node_modules/nm-viewmodel/lib', copy)
//   exists('./lib', '../nm-pcrender/node_modules/nm-viewmodel/lib', copy)
// } catch (e) {
//   console.error(e)
// }
function copyfile(filePath) {
  filePath.forEach(function (item) {
    var srcDirectory = path.join(
      path.resolve('./'),
      '/' + item.path + '/' + item.output
    )
    console.log('src:', srcDirectory)
    var destDirectory = path.join(path.resolve('./dist'), '/' + item.path)
    console.log('dest:', destDirectory)
    exists(srcDirectory, destDirectory, copy)
  })
}
exports.default = copyfile
