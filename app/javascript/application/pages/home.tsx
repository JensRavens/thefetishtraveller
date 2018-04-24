import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';
import {EventWithLocation, joinLocation} from '../models/event';
import {Like, isLiked} from '../models/like';

import {EventListing} from '../components/event_listing';
import Container from '../components/container';
import Hero from '../components/hero';

const backgroundImage = require('../assets/background.jpg');

interface Props {
  events: EventWithLocation[];
  likes: Like[];
}

const mapStateToProps: (state: State) => Props = (state) => {
  return {
    events: joinLocation(new DB(state).table('events').all.sort((a,b) => (a.startAt as any) - (b.startAt as any)), state),
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
            <h1>Find the best events worldwide</h1>
          </Container>
        </Hero>
        <Container>
          <div className="listing">
            {events.map(e => <EventListing key={e.id} event={e} liked={isLiked(e, likes)}/>)}
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(Home);
