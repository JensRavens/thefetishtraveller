const mode = process.env.NODE_ENV || 'development';

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env')({ stage: 0 }),
    mode !== 'development' && require('cssnano'),
  ].filter(Boolean),
};
