module.exports = {
  extends: ['standard'],
  parser: 'babel-eslint',
  plugins: ['standard', 'promise'],
  globals: {
    jest: false,
    describe: false,
    it: false,
    expect: false
  }
}
