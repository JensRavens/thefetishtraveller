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

environment.loaders.get('sass').use.splice(-1, 0, {
  loader: 'resolve-url-loader'
});
module.exports = environment
