import * as React from 'react';

import Hero from '../components/hero';
import FacebookLogin from '../components/facebook_login';
import Container from '../components/container';
import { scoped } from '../i18n';

const t = scoped('login');

export default class LoginPage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Hero>
          <Container>
            <h1 className="with-dash">{t('.claim')}</h1>
            <div className="hero__addon">
              <h5>{t('.intro')}</h5>
              <div className="spacer spacer--tiny"/>
              <p className="text-center">
                <FacebookLogin/>
              </p>
            </div>
          </Container>
        </Hero>
        <Container variant='small'>
          <div className="spacer"/>
          <h3>{t('.why')}</h3>
          <p>{t('.why_explanation')}</p>
          <h3>{t('.how')}</h3>
          <p>{t('.how_explanation')}</p>
          <div className="spacer"/>
        </Container>
      </React.Fragment>
    );
  }
}
