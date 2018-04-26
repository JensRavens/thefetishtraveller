import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {EventWithLocation, canEdit, joinLocation} from '../models/event';
import {Like} from '../models/like';
import {locationDescription, extractCoordinates} from '../models/location';
import {DB, DBAction, writeDB, State} from '../state';
import {APISession} from '../api';
import Container from '../components/container';
import Hero from '../components/hero';
import LikeButton from '../components/like-button';
import Listing from '../components/listing';
import {Meta} from '../components/meta';
import {EventListing} from '../components/event_listing';
import {Map} from '../components/map';
import {dateRange} from '../util';

interface Props {
  id: string;
  event?: EventWithLocation;
  like?: Like;
  editable: boolean;
  dispatch: (DBAction) => void;
  otherEvents: EventWithLocation[];
}

const likes = writeDB.table('likes');

function format(text: string): any {
  return text.split("\n").map(e => <p>{e}</p>);
}

function link(url?: string) {
  return url ? <a href={url} target="_blank">{url.replace(/https?\:\/\/(www\.)?/, '').split('/')[0]}</a> : null;
}

class EventPage extends React.Component<Props> {
  like() {
    this.props.dispatch(likes.insert({eventId: this.props.id}));
  }

  unlike(like: Like) {
    this.props.dispatch(likes.delete(like));
  }

  render() {
    let {event, like, editable, otherEvents} = this.props;
    if(!event) { return null };
    const hero = event.hero && event.hero.big;
    const coordinates = extractCoordinates(event.location);
    const meta = [
      ['Date', dateRange(event.startAt, event.endAt)],
      ['Location', locationDescription(event.location)],
      ['Website', link(event.website)],
      ['Organizer', event.organizerName],
      ['Tickets', link(event.ticketLink)]
    ].filter(e => e[1]);
    return (
      <React.Fragment>
        <div className="spacer spacer--for-navbar"/>
        <Meta title={event.name}/>
        <Container variant="small">
          <h2>{event.name}</h2>
          {event.abstract && [<h4>{event.abstract}</h4>,<div className="spacer--small"/>]}
          {hero && <p><img src={hero}/></p>}
          <div className={`meta-box meta-box--${hero && 'floating'}`}>
            {
              meta.map(e => (
                <p key={e[0] as string}>
                  <strong>{e[0]}</strong><br/>
                  {e[1]}
                </p>
              ))
            }
          </div>
          {event.description && format(event.description)}
          <h3>{locationDescription(event.location)}</h3>
          {coordinates && <Map center={coordinates}/>}
        </Container>
        {otherEvents.length && (
          <React.Fragment>
            <Container variant="small">
              <div className="spacer"/>
              <h2>Other Events in {event.location.name}</h2>
              <div/>
            </Container>
            <Listing>{otherEvents.map(e => <EventListing key={e.id} event={e} />)}</Listing>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: State, props) => {
  const id: string = props.match.params.id;
  const db = new DB(state);
  let event: EventWithLocation | null = joinLocation([id], state)[0];
  let otherEvents: EventWithLocation[] = joinLocation(db.table('events').where({locationId: event.locationId}).filter(e => e.id != id), state);
  const editable = canEdit(event, db.get('session'));
  const like = db.table('likes').where({eventId: id})[0]
  return {event, id, like, editable, otherEvents};
}

export default connect(mapStateToProps)(EventPage)
