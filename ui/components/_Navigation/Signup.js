import PropTypes from 'prop-types'
import {g, colors, type, Dialog, TextField, FormError, FlatButton} from 'next-md'

import api from '../../lib/api'

class Signup extends React.Component {
  state = {
    form: {},
    errors: {}
  }

  setFormValue = key => e => this.setState({
    form: {
      ...this.state.form,
      [key]: e.target.value
    },
    errors: {
      ...this.state.errors,
      [key]: null
    }
  })

  signup = async e => {
    e.preventDefault()

    try {
      await api({url: '/signup', method: 'post', data: this.state.form})
    } catch (err) {
      this.setState({errors: err.response ? err.response.data : {}})
      return
    }

    // just reload the window on success
    window.location.reload()
  }

  render () {
    const {active, onClose} = this.props
    const {form, errors} = this.state

    return (
      <Dialog active={active} onClose={onClose}>
        <form onSubmit={this.signup}>
          <div className='heading'>Sign up</div>
          <div className='fieldset'>
            <label>Name</label>
            <TextField
              value={form.name}
              onChange={this.setFormValue('name')} />
            <FormError>{errors.name}</FormError>
          </div>
          <div className='fieldset'>
            <label>Email</label>
            <TextField
              value={form.email}
              error={errors.email}
              onChange={this.setFormValue('email')} />
            <FormError>{errors.email}</FormError>
          </div>
          <div className='fieldset'>
            <label>Password</label>
            <TextField
              type='password'
              value={form.password}
              error={errors.password}
              onChange={this.setFormValue('password')} />
            <FormError>{errors.password}</FormError>
          </div>
          <div className='fieldset'>
            <label>Confirm password</label>
            <TextField
              type='password'
              value={form.confirm_password}
              error={errors.confirm_password}
              onChange={this.setFormValue('confirm_password')} />
            <FormError>{errors.confirm_password}</FormError>
          </div>
          <FlatButton
            style={{
              alignSelf: 'center'
            }}
            onClick={this.signup}>
            Sign up
          </FlatButton>
        </form>
        <style jsx>{`
          form {
            display: flex;
            flex-direction: column;

            padding: ${g(3)} ${g(1)};
          }

          .heading {
            ${type.subheading}
            font-weight: 300;
            text-align: center;
          }

          .fieldset {
            margin-bottom: ${g(4)};
          }

          label {
            ${type.subheading}
            color: ${colors.textBlackSecondary};
            font-weight: 300;
          }
        `}</style>
      </Dialog>
    )
  }
}

Signup.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func
}

export default Signup
