import * as React from 'react';

import Hero from '../components/hero';
import Login from '../components/login';
import Container from '../components/container';

export default class LoginPage extends React.Component {
  render() {
    return (
      <Hero>
        <Container>
          <Login/>
        </Container>
      </Hero>
    );
  }
}
