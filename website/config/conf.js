const {resolve} = require('./paths');

module.exports = {
  alias: {
    'react-native': 'react-native-web',
    c: resolve('src/c'),
  },
};