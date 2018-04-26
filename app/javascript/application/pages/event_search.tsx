import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';
import {EventWithLocation, joinLocation, chronological} from '../models/event';
import {Like, isLiked} from '../models/like';
import {EventListing} from '../components/event_listing';
import Container from '../components/container';
import Hero from '../components/hero';
import Listing from '../components/listing';

interface Props {
  events: EventWithLocation[];
  likes: Like[];
}

const mapStateToProps: (state: State) => Props = (state) => {
  return {
    events: joinLocation(new DB(state).table('events').all.sort(chronological), state),
    likes: new DB(state).table('likes').all
  }
}

class EventSearch extends React.Component<Props> {
  render() {
    const {events, likes} = this.props;
    return (
      <React.Fragment>
        <Hero>
          <Container>
            <h1>Events</h1>
          </Container>
        </Hero>
        <Listing>
          {events.map(e => <EventListing key={e.id} event={e} liked={isLiked(e, likes)}/>)}
        </Listing>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(EventSearch)
