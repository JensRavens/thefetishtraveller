import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';
import {Event, refreshEvents} from '../models/event';
import {Like, refreshLikes, isLiked} from '../models/like';
import {EventListing} from '../components/event_listing';
import Container from '../components/container';

interface Props {
  events: Event[];
  likes: Like[];
}

const mapStateToProps: (state: State) => Props = (state) => {
  return {
    events: new DB(state).table('events').all.sort((a,b) => (a.startAt as any) - (b.startAt as any)),
    likes: new DB(state).table('likes').all
  }
}

class EventSearch extends React.Component<Props> {
  componentDidMount() {
    refreshEvents();
    refreshLikes();
  }

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
