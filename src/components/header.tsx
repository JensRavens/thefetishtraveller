import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useSession } from '../models/session';
import { scoped } from '@nerdgeschoss/i18n';
import { gql, useQuery } from '@apollo/client';
import { MenuQuery } from '../generated/MenuQuery';

const t = scoped('menu');

const DATA = gql`
  query MenuQuery {
    me {
      hasEvents
    }
  }
`;

export default function Header(): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const session = useSession();
  const loggedIn = !!session;
  const { data } = useQuery<MenuQuery>(DATA);
  const hasLikes = data && data.me && data.me.hasEvents;
  const closeMenu = () => setExpanded(false);
  return (
    <header className="header">
      <nav className={`main-menu ${expanded && 'main-menu--expanded'}`}>
        <div className="main-menu__category logo">
          <NavLink to="/">
            The <em>Fetish</em> Traveller
          </NavLink>
        </div>
        <nav className="main-menu__mobile">
          <div className="main-menu__category">
            <NavLink onClick={closeMenu} to="/events">
              {t('.events')}
            </NavLink>
            <NavLink onClick={closeMenu} to="/locations">
              {t('.locations')}
            </NavLink>
          </div>
          <div className="main-menu__category">
            {hasLikes && (
              <NavLink onClick={closeMenu} to="/calendar">
                {t('.your_calendar')}
              </NavLink>
            )}
            {
              <NavLink to="/login">
                {loggedIn ? t('.logout') : t('.login')}
              </NavLink>
            }
          </div>
        </nav>
        <div
          className="main-menu__switch"
          onClick={() => setExpanded(expanded => !expanded)}
        >
          <div className="main-menu__switch-icon" />
        </div>
        <div className="main-menu__category main-menu__category--additional">
          <NavLink to="/events">{t('.events')}</NavLink>
          <NavLink to="/locations">{t('.locations')}</NavLink>
        </div>
        <div className="main-menu__category main-menu__category--additional">
          {hasLikes && session && (
            <NavLink to={`/travel-plans/${session.userId}`}>
              {t('.your_calendar')}
            </NavLink>
          )}
          {
            <NavLink to="/login">
              {loggedIn ? t('.logout') : t('.login')}
            </NavLink>
          }
        </div>
      </nav>
    </header>
  );
}
