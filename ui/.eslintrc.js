module.exports = {
  extends: ['standard', 'standard-react'],
  parser: 'babel-eslint',
  plugins: ['standard', 'promise'],
  rules: {
    'react/react-in-jsx-scope': 0,
    'camelcase': 0
  },
  globals: {
    WebSocket: false,
    TextDecoder: false,

    React: false,
    describe: false,
    it: false,
    expect: false
  }
}
