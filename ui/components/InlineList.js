import PropTypes from 'prop-types'

import {g} from 'next-md'

class InlineList extends React.Component {
  render () {
    const {children, spacers, ...other} = this.props
    return (
      <ul className={`body1 ${spacers && 'spacers'}`} {...other}>
        {children}
        <style jsx>{`
          ul {
            padding: 0;

            font-weight: 100;

            list-style-type: none;
          }

          ul :global(li) {
            display: inline-block;
          }

          ul :global(li:not(:last-of-type)) {
            margin-right: ${g(3)};
          }

          ul.spacers :global(li:not(:last-of-type)) {
            padding-right: ${g(3)};
            margin-right: ${g(3)};

            border-right: 1px solid rgba(255, 255, 255, 0.26);
          }
        `}</style>
      </ul>
    )
  }
}

InlineList.propTypes = {
  children: PropTypes.node,
  spacers: PropTypes.bool
}

InlineList.defaultProps = {
  spacers: true
}

export default InlineList
