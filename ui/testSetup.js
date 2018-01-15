import Cookies from 'js-cookie'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

// eslint-disable-next-line no-undef
jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000

// Tucker's _id
Cookies.set(
  'jwt',
  process.env.JWT_TEST
)
