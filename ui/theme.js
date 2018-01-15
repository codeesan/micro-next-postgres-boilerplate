import Color from 'color'

export default {
  colors: {
    primary: '#ebe8e0',
    primaryDark: Color('#ebe8e0').darken(0.075).rgb().toString(),
    primaryDarker: Color('#ebe8e0').darken(0.15).rgb().toString(),
    secondary: '#231f20'
  }
}
