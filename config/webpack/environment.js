const { environment } = require('@rails/webpacker')
const typescript =  require('./loaders/typescript')

environment.loaders.append('typescript', typescript);
environment.loaders.append('json', {
  test: /\.yml$/,
  use: 'json-loader'
});
environment.loaders.append('yml', {
  test: /\.yml$/,
  use: 'yaml-loader'
});
module.exports = environment
