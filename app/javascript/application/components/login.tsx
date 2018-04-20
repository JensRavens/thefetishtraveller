import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

import {APISession, api} from '../api';
import {State} from '../state';

import Container from './container';
import Form from './form';
import FormField from './form_field';

interface Props {
  session: APISession;
}

interface LoginState {
  email?: string;
  password?: string;
}

class Login extends React.Component<Props, LoginState> {
  state = {};

  render() {
    if (this.loggedIn) { return null };
    return (
      <div>
        <Form model={this.state} onSubmit={this.submit.bind(this)} onChange={model => this.setState(model)}>
          <FormField name="email"/>
          <FormField name="password"/>
          <input type="submit" />
        </Form>
      </div>
    )
  }

  private submit(model: LoginState){
    api.login(model.email, model.password);
  }

  private get loggedIn(): boolean {
    const {session} = this.props;
    return session.level && session.level !== 'guest';
  }
}

const mapStateToProps: (state: State) => Props = (state) => {
  return {session: state.settings.session};
}

export default connect(mapStateToProps)(Login);
