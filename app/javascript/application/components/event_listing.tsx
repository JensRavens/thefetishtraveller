import * as React from 'react';
import {Event} from '../models/event';
import {Link} from 'react-router-dom';

interface Props {
  event: Event;
}

export class EventListing extends React.Component<Props> {
  render() {
    const {event} = this.props;
    return (
      <div>Event <Link to={`/events/${event.id}`}>{event.name}</Link>.</div>
    )
  }
}
