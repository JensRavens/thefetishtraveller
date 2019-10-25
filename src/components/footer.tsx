import React from 'react';
import { NavLink } from 'react-router-dom';

import { scoped, I18n } from '@nerdgeschoss/i18n';

import Container from './container';

const t = scoped('footer');
import twitter from '../assets/twitter.svg';
import facebook from '../assets/facebook.svg';

export default class Header extends React.Component {
  public render() {
    return (
      <footer className="footer">
        <Container>
          <div className="footer__category">
            <div className="logo">
              The <em>Fetish</em> Traveller
            </div>
            <div className="footer__social">
              <a
                href="https://twitter.com/thefetishtrave1"
                target="_blank"
                rel="noopener"
              >
                <img src={twitter}></img>
              </a>
              <a
                href="https://www.facebook.com/thefetishtraveller"
                target="_blank"
                rel="noopener"
              >
                <img src={facebook}></img>
              </a>
            </div>
            <div className="footer__copyright">
              © 2019 Jens Ravens
              <br />
              All Rights Reserved
            </div>
          </div>
          <div className="footer__category">
            <div className="footer__headline">{t('.about_us')}</div>
            <p>{t('.about_us_text')}</p>
          </div>
          <nav className="footer__category">
            <div className="footer__headline">{t('.quick_navigation')}</div>
            <NavLink to="/">{t('menu.home')}</NavLink>
            <br />
            <NavLink to="/imprint">{t('menu.imprint')}</NavLink>
            <br />
            <NavLink to="/events/submit">{t('menu.submit')}</NavLink>
            <div className="footer__locales">
              {['en', 'de'].map(e => (
                <a
                  className={I18n.locale === e ? 'active' : ''}
                  key={e}
                  onClick={() => (I18n.locale = e)}
                >
                  {e}
                </a>
              ))}
            </div>
          </nav>
        </Container>
      </footer>
    );
  }
}
