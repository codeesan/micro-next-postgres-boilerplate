import PropTypes from 'prop-types'

import api from '../lib/api'
import Page from '../components/Page'
import Admin from '../components/Admin'

class AdminPage extends React.Component {
  render () {
    const {me, url} = this.props
    return (
      <Page me={me} pathname={url.asPath || url.pathname}>
        <Admin />
      </Page>
    )
  }
}

AdminPage.propTypes = {
  me: PropTypes.object,
  url: PropTypes.object
}

AdminPage.getInitialProps = async ({req, res}) => {
  let me

  try {
    const res = await api({req, url: '/me'})
    me = res.data
  } catch (err) {}

  if (!me || !me.is_admin) {
    res.setHeader('location', '/')
    res.statusCode = 302
    res.end('Found')
    return
  }

  return {me}
}

export default AdminPage
