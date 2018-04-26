import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';
import {EventWithLocation, joinLocation, chronological, isCurrent} from '../models/event';
import {Like, isLiked} from '../models/like';

import {EventListing} from '../components/event_listing';
import Container from '../components/container';
import Hero from '../components/hero';
import Listing from '../components/listing';

const backgroundImage = require('../assets/background.jpg');

interface Props {
  events: EventWithLocation[];
  likes: Like[];
}

const mapStateToProps: (state: State) => Props = (state) => {
  const events = joinLocation(new DB(state).table('events').where(isCurrent).sort(chronological), state);
  return {
    events: events.slice(0, 3),
    likes: new DB(state).table('likes').all
  }
}

class Home extends React.Component<Props> {
  render() {
    const {events, likes} = this.props;
    return (
      <React.Fragment>
        <Hero backgroundImage={backgroundImage} style="expanded">
          <Container>
            <h1>Find the best events <em>worldwide</em></h1>
          </Container>
        </Hero>
        <div className="spacer"/>
        <h2>Next up</h2>
        <Listing>
          {events.map(e => <EventListing key={e.id} event={e} liked={isLiked(e, likes)}/>)}
        </Listing>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(Home);
