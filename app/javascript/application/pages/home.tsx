import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';
import {EventWithLocation, joinLocation, chronological, isCurrent} from '../models/event';
import {Like, isLiked} from '../models/like';

import {EventListing} from '../components/event_listing';
import Container from '../components/container';
import Hero from '../components/hero';
import Listing from '../components/listing';
import {Signup} from '../components/signup';
import {scoped} from '../i18n';

const backgroundImage = require('../assets/background.jpg');

interface Props {
  events: EventWithLocation[];
  likes: Like[];
}

const mapStateToProps: (state: State) => Props = (state) => {
  const events = joinLocation(new DB(state).table('events').where(isCurrent).sort(chronological), state);
  return {
    events: events.slice(0, 6),
    likes: new DB(state).table('likes').all
  }
}

const t = scoped('home');

class Home extends React.Component<Props> {
  render() {
    const {events, likes} = this.props;
    return (
      <React.Fragment>
        <Hero backgroundImage={backgroundImage} style="expanded">
          <Container>
            <h1>{t('.claim')}</h1>
          </Container>
        </Hero>
        <div className="spacer"/>
        <h2>{t('.next_up')}</h2>
        <Listing singleLine={true}>
          {events.map(e => <EventListing key={e.id} event={e} liked={isLiked(e, likes)}/>)}
        </Listing>
        <Signup/>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(Home);
