import PropTypes from 'prop-types'

import api from '../lib/api'
import Page from '../components/Page'
import Index from '../components/Index'

class IndexPage extends React.Component {
  render () {
    const {me, url} = this.props
    return (
      <Page me={me} pathname={url.asPath || url.pathname}>
        <Index />
      </Page>
    )
  }
}

IndexPage.propTypes = {
  url: PropTypes.object,
  me: PropTypes.object
}

IndexPage.getInitialProps = async ({req}) => {
  let me

  try {
    const res = await api({req, url: '/me'})
    me = res.data
  } catch (err) {}

  return {me}
}

export default IndexPage
