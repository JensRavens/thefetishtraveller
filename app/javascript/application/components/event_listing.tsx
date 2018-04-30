import * as React from 'react';
import {EventWithLocation} from '../models/event';
import {locationDescription} from '../models/location';
import {Link} from 'react-router-dom';

import {dateRange} from '../util';
import {scoped} from '../i18n';

interface Props {
  event: EventWithLocation;
  liked?: boolean;
}

const t = scoped('event');

export class EventListing extends React.Component<Props> {
  render() {
    const {event, liked} = this.props;
    const backgroundImage = event.hero && event.hero.medium && `url(${event.hero.medium})`;
    const category = (event.categories || []).map(e => t('.category.' + e)).join(', ');
    return (
      <Link to={`/events/${event.slug}`} className="event-listing" style={{backgroundImage}}>
        <div className="event-listing__background"/>
        <div className="event-listing__content">
          {liked && <div className="event-listing__marker">On Your Calendar</div>}
          <div className="event-listing__category">{category}</div>
          <div className="event-listing__name">{event.name}</div>
          <div className="event-listing__description"></div>
          <div className="event-listing__details">
            {locationDescription(event.location)} <br/> {dateRange(event.startAt, event.endAt)}
          </div>
        </div>
      </Link>
    )
  }
}
