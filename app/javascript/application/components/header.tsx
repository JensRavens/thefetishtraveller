import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

import Container from './container';
import {State, DB} from '../state';
import {isLoggedIn} from '../models/session';
import {scoped} from '../i18n';

interface Props {
  loggedIn: boolean;
  hasLikes: boolean;
}

interface MenuState {
  expanded: boolean;
}

const t = scoped('menu');

class Header extends React.Component<Props, MenuState> {
  state = {expanded: false}

  render() {
    const {loggedIn, hasLikes} = this.props;
    const {expanded} = this.state;
    const closeMenu = () => this.setState({expanded: false});
    return (
      <header className="header">
        <nav className={`main-menu ${expanded && 'main-menu--expanded'}`}>
          <div className="main-menu__category logo">
            <NavLink to="/">The <em>Fetish</em> Traveller</NavLink>
          </div>
          <nav className="main-menu__mobile">
            <div className="main-menu__category">
              <NavLink onClick={closeMenu}  to="/events">{t('.events')}</NavLink>
              {loggedIn && <NavLink onClick={closeMenu}  to="/locations">Locations</NavLink>}
            </div>
            <div className="main-menu__category">
              {hasLikes && <NavLink onClick={closeMenu}  to="/calendar">{t('.your_calendar')}</NavLink>}
            </div>
          </nav>
          <div className="main-menu__switch" onClick={() => this.setState({expanded: !expanded})}><div className="main-menu__switch-icon"/></div>
          <div className="main-menu__category main-menu__category--additional">
            <NavLink to="/events">{t('.events')}</NavLink>
            {/* {loggedIn && <NavLink to="/locations">Locations</NavLink>} */}
          </div>
          <div className="main-menu__category main-menu__category--additional">
            {hasLikes && <NavLink to="/calendar">{t('.your_calendar')}</NavLink>}
            {<NavLink to="/login">{loggedIn ? t('.logout') : t('.login')}</NavLink>}
          </div>
        </nav>
      </header>
    )
  }
}

const mapStateToProps: (state: State) => Props = (state) => {
  const hasLikes = new DB(state).table('likes').all.filter(e => e.state !== 'deleted').length > 0;
  const loggedIn = isLoggedIn(state.settings.session);
  return {loggedIn, hasLikes};
}

export default connect(mapStateToProps)(Header);
