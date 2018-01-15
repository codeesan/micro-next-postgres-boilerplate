import PropTypes from 'prop-types'
import Link from 'next/link'
import {type} from 'next-md'
import api from '../../lib/api'

import InlineList from '../InlineList'
import Signup from './Signup'
import Login from './Login'

class Navigation extends React.Component {
  state = {
    activeModal: null
  }

  setActiveModal = activeModal => () => this.setState({activeModal})

  logout = async () => {
    await api({url: '/logout'})

    window.location.reload()
  }

  render () {
    const {me, pathname} = this.props
    const {activeModal} = this.state

    if (!me) {
      return (
        <InlineList spacers={false} style={{margin: '0 0 0 auto'}}>
          <li>
            <a
              className='navButton'
              onClick={this.setActiveModal('signup')}>
              sign up
            </a>
          </li>
          <li>
            <a
              className='navButton'
              onClick={this.setActiveModal('login')}>
              log in
            </a>
          </li>
          <Signup
            active={activeModal === 'signup'}
            onClose={this.setActiveModal(null)} />
          <Login
            active={activeModal === 'login'}
            onClose={this.setActiveModal(null)} />
          <style jsx>{`
            .navButton {
              text-transform: uppercase;

              ${type.subheading}
              font-weight: 300;

              cursor: pointer;
            }
          `}</style>
        </InlineList>
      )
    }
    return (
      <InlineList spacers={false} style={{margin: '0 0 0 auto'}}>
        {me.is_admin &&
          <li>
            <Link
              href='/admin'
              prefetch>
              <a
                className={`navButton ${pathname.startsWith('/admin') && 'active'}`}>
                admin
              </a>
            </Link>
          </li>
        }
        <li>
          <a
            className='navButton'
            onClick={this.logout}>
            log out
          </a>
        </li>
        <style jsx>{`
          .navButton {
            text-transform: uppercase;

            ${type.subheading}
            font-weight: 300;

            cursor: pointer;
          }
        `}</style>
      </InlineList>
    )
  }
}

Navigation.propTypes = {
  me: PropTypes.object,
  pathname: PropTypes.string
}

Navigation.defaultProps = {
  pathname: '/'
}

export default Navigation
