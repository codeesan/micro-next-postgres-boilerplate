import {
  cyan500,
  grey100, grey300, grey500,
  white, darkBlack, fullBlack
} from 'material-ui/styles/colors'
import Color from 'color'
import { fade } from 'material-ui/utils/colorManipulator'
import spacing from 'material-ui/styles/spacing'

import theme from '../../theme'

export default {
  spacing: spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: Color(theme.colors.secondary).rgb().string(),
    primary2Color: Color(theme.colors.secondary).darken(0.2).rgb().string(),
    primary3Color: white,
    accent1Color: theme.secondary,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack
  }
}
