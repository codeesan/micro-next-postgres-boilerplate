import React from 'react'
import NoSSR from 'react-no-ssr'
import { Admin as AOR, Resource, Delete, Menu } from 'admin-on-rest'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import postgrestClient from './lib/aor-postgrest-client'
import { UserList, UserEdit, UserCreate, UserChangePassword } from './Resources/users'
import Dashboard from './Dashboard'
import theme from './theme'

class Admin extends React.Component {
  render () {
    return (
      <NoSSR>
        <div className='admin'>
          <AOR
            title='Admin'
            dashboard={Dashboard}
            restClient={postgrestClient(process.env.MY_APP_API_URL)}
            menu={Menu}
            theme={getMuiTheme(theme)}>
            <Resource
              name='users'
              list={UserList}
              edit={UserEdit}
              changePassword={UserChangePassword}
              create={UserCreate}
              remove={Delete} />
          </AOR>
        </div>
        <style jsx>{`
          .admin {
            width: 100%;
          }
        `}</style>
      </NoSSR>
    )
  }
}

Admin.propTypes = {
}

export default Admin
