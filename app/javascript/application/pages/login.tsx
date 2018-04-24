import * as React from 'react';

import Container from '../components/container';
import Login from '../components/login';

export default class LoginPage extends React.Component {
  render() {
    return (
      <Container>
        <Login/>
      </Container>
    );
  }
}
