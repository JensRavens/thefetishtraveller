import * as React from 'react';
import {EventWithLocation} from '../models/event';
import {Link} from 'react-router-dom';

import Card from './card';
import {dateRange} from '../util';

interface Props {
  event: EventWithLocation;
  liked?: boolean;
}

export class EventListing extends React.Component<Props> {
  render() {
    const {event, liked} = this.props;
    return (
      <Link to={`/events/${event.id}`}>
        <Card>
          <div>{event.name} <small>{dateRange(event.startAt, event.endAt)}</small>{liked && '❤️'}</div>
          <div>{event.location.city}, {event.location.countryCode}</div>
        </Card>
      </Link>
    )
  }
}
