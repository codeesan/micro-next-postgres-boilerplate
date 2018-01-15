// See https://github.com/facebook/jest/issues/4545#issuecomment-332762365

import raf from 'raf'

global.requestAnimationFrame = raf
