import React from 'react'
import {g} from 'next-md'

class Index extends React.Component {
  render () {
    return (
      <div className='index'>
        micro-next-postgres-boilerplate
        <style jsx>
          {`
            .index {
              padding-top: ${g(12)};

              text-align: center;
            }
          `}
        </style>
      </div>
    )
  }
}

Index.propTypes = {
}

export default Index
