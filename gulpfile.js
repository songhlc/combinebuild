var config = require('./src').default
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
var output = config(filePath)
exports.default = output