import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';
import {Event, refreshEvents} from '../models/event';
import {EventListing} from './event_listing';
import Container from './container';

interface Props {
  events: Event[];
}

const mapStateToProps: (state: State) => Props = (state) => {
  return {
    events: new DB(state).table('events').all
  }
}

class EventSearch extends React.Component<Props> {
  componentDidMount() {
    refreshEvents();
  }

  render() {
    return (
      <Container>
        {this.props.events.map(e => <EventListing key={e.id} event={e}/>)}
      </Container>
    );
  }
}

export default connect(mapStateToProps)(EventSearch)
