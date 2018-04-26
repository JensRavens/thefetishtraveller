import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {EventWithLocation, canEdit, joinLocation} from '../models/event';
import {Like} from '../models/like';
import {locationDescription} from '../models/location';
import {DB, DBAction, writeDB, State} from '../state';
import {APISession} from '../api';
import Container from '../components/container';
import Hero from '../components/hero';
import LikeButton from '../components/like-button';
import Listing from '../components/listing';
import {Meta} from '../components/meta';
import {EventListing} from '../components/event_listing';
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
    const backgroundImage = event.hero && event.hero.big;
    return (
      <React.Fragment>
        <Meta title={event.name}/>
        <Hero backgroundImage={backgroundImage} style={backgroundImage ? 'expanded' : 'normal'}>
          <Container>
            <h1>{event.name}</h1>
          </Container>
        </Hero>
        <div className="spacer"/>
        <Container>
          <h4>{dateRange(event.startAt, event.endAt)} - {locationDescription(event.location)}</h4>
          <div className="text-center"><LikeButton active={!!like} onClick={() => !!like ? this.unlike(like) : this.like()}/></div>
          {editable && <div><Link to={`/events/${event.id}/edit`}>edit</Link></div>}
          <h2>Location</h2>
        </Container>
        {otherEvents.length && (
          <React.Fragment>
            <div className="spacer"/>
            <h2>Other Events in {event.location.name}</h2>
            <Listing>{otherEvents.map(e => <EventListing event={e} />)}</Listing>
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
