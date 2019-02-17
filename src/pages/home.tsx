import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { DB, State } from '../state';
import {
  EventWithLocation,
  joinLocation,
  chronological,
  isCurrent,
} from '../models/event';
import { Like, isLiked } from '../models/like';

import { EventListing } from '../components/event_listing';
import Container from '../components/container';
import Hero from '../components/hero';
import Listing from '../components/listing';
import { Signup } from '../components/signup';
import { Meta } from '../components/meta';
import { scoped } from '@nerdgeschoss/i18n';

import backgroundImage from '../assets/background.jpg';

interface Props {
  events: EventWithLocation[];
  likes: Like[];
}

const mapStateToProps: (state: State) => Props = state => {
  const events = joinLocation(
    new DB(state)
      .table('events')
      .where(isCurrent)
      .sort(chronological),
    state
  );
  return {
    events: events.slice(0, 6),
    likes: new DB(state).table('likes').all,
  };
};

const t = scoped('home');

class Home extends React.Component<Props> {
  public render() {
    const { events, likes } = this.props;
    return (
      <React.Fragment>
        <Meta title={null} />
        <Hero backgroundImage={backgroundImage} style="expanded">
          <Container>
            <h1 className="with-dash">{t('.claim')}</h1>
            <div className="hero__addon">
              <h5>{t('.intro')}</h5>
              <div className="spacer spacer--tiny" />
              <p className="text-center">
                <Link to="/events" className="button">
                  {t('.explore_events_now')}
                </Link>
              </p>
            </div>
          </Container>
        </Hero>
        <div className="spacer" />
        <h2>{t('.next_up')}</h2>
        <Listing singleLine={true}>
          {events.map(e => (
            <EventListing key={e.id} event={e} liked={isLiked(e, likes)} />
          ))}
        </Listing>
        <div className="button-line button-line--dark">
          <Link to="/events" className="button">
            {t('.find_more_events')}
          </Link>
        </div>
        <Signup />
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(Home);
