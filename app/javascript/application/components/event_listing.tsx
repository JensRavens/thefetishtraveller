import * as React from 'react';
import {Event} from '../models/event';
import {Link} from 'react-router-dom';

import Card from './card';
import {dateRange} from '../util';

interface Props {
  event: Event;
  liked?: boolean;
}

export class EventListing extends React.Component<Props> {
  render() {
    const {event, liked} = this.props;
    return (
      <Link to={`/events/${event.id}`}>
        <Card>
          <div>{event.name} <small>{dateRange(event.startAt, event.endAt)}</small>{liked && '❤️'}</div>
          <div>{event.city}, {event.countryCode}</div>
        </Card>
      </Link>
    )
  }
}
