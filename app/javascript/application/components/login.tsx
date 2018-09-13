import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { APISession } from '../api';
import { syncer } from '../api-syncer';
import { State } from '../state';
import { isLoggedIn } from '../models/session';

import Container from './container';
import Form from './form';
import FormField from './form_field';

interface Props {
  session?: APISession;
}

interface LoginState {
  email?: string;
  password?: string;
}

class Login extends React.Component<Props, LoginState> {
  state = {};

  render() {
    if (isLoggedIn(this.props.session)) {
      return null;
    }
    return (
      <div>
        <Form
          model={this.state}
          onSubmit={this.submit.bind(this)}
          onChange={model => this.setState(model)}
        >
          <FormField name="email" />
          <FormField name="password" />
          <input type="submit" />
        </Form>
      </div>
    );
  }

  private submit(model: LoginState) {
    if (!model.email || !model.password) {
      return;
    }
    syncer.login(model.email, model.password);
  }
}

const mapStateToProps: (state: State) => Props = state => {
  return { session: state.settings.session };
};

export default connect(mapStateToProps)(Login);
