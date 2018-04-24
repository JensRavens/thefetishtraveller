import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';
import {EventWithLocation, joinLocation} from '../models/event';
import {Like, isLiked} from '../models/like';
import {EventListing} from '../components/event_listing';
import Container from '../components/container';

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

class EventSearch extends React.Component<Props> {
  render() {
    const {events, likes} = this.props;
    return (
      <Container>
        <h1>Events</h1>
        {events.map(e => <EventListing key={e.id} event={e} liked={isLiked(e, likes)}/>)}
      </Container>
    );
  }
}

export default connect(mapStateToProps)(EventSearch)
