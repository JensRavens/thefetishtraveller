import * as React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Event, EventWithLocation, canEdit, joinLocation} from '../models/event';
import {Like, isLiked} from '../models/like';
import {locationDescription, extractCoordinates, isVenue} from '../models/location';
import {DB, writeDB, State} from '../state';
import Container from '../components/container';
import Listing from '../components/listing';
import {Meta} from '../components/meta';
import {EventListing} from '../components/event_listing';
import {Map} from '../components/map';
import Editable from '../components/editable';
import {dateRange} from '../util';
import {scoped} from '../i18n';
import {syncer} from '../api-syncer';
import {guid} from '../util';
import { JsonLd } from '../components/JsonLd';
import { isLoggedIn } from '../models/session';
import LikeButton from '../components/like-button';

interface Props {
  event?: EventWithLocation;
  liked: boolean;
  loggedIn: boolean;
  editable: boolean;
  dispatch: (DBAction) => void;
  otherEvents: EventWithLocation[];
  subevents: EventWithLocation[];
  newEvent: boolean;
  history: any;
}

interface EventState {
  changes: Partial<Event>;
  editing: boolean;
}

function format(text: string): any {
  return text.split("\n").map((e, i) => <p key={i}>{e}</p>);
}

function link(url?: string) {
  return url ? <a href={url} target="_blank">{url.replace(/https?\:\/\/(www\.)?/, '').split('/')[0]}</a> : null;
}

const t = scoped('event');

class EventPage extends React.Component<Props, EventState> {
  constructor(props){
    super(props);
    this.state = {changes: {}, editing: props.newEvent};
    this.onChange = this.onChange.bind(this);
  }

  render() {
    let {event, liked, editable, otherEvents, subevents, loggedIn} = this.props;
    if(!event) { return null };
    event = Object.assign({}, event, this.state.changes);
    const hero = event.hero && event.hero.big;
    const flyer = event.flyer && event.flyer.big;
    const coordinates = extractCoordinates(event.location);
    const onChange = this.onChange;
    const editing = this.state.editing;
    const meta = [
      [t('.date'), true, editing ? [<Editable key="startat" placeholder={t('.startAt')} value={event.startAt && event.startAt.toISOString()} onBlur={onChange('startAt', 'date')}/>,<Editable key="endat" placeholder={t('.endAt')} value={event.endAt && event.endAt.toISOString()} onBlur={onChange('endAt', 'date')}/>] : dateRange(event.startAt, event.endAt)],
      [t('.location'), true, <Editable placeholder={t('.location')} editable={editing} value={locationDescription(event.location)} editValue={event.locationSlug || event.location.slug} onChange={onChange('locationSlug')}/>],
      [t('.website'), event.website || editing, <Editable placeholder={t('.website')} editable={editing} value={link(event.website)} editValue={event.website} onChange={onChange('website')}/>],
      [t('.organizer'), event.organizerName || editing, <Editable placeholder={t('.organizer')} editable={editing} value={event.organizerName} onChange={onChange('organizerName')}/>],
      [t('.tickets'), event.ticketLink || editing, <Editable placeholder={t('.tickets')} editable={editing} value={link(event.ticketLink)} onChange={onChange('ticketLink')}/>],
      [t('.slug'), editing, <Editable placeholder={t('.slug')} editable={editing} value={event.slug} onChange={onChange('slug')}/>],
    ].filter(e => e[1]);
    const images = [event.hero && event.hero.big, event.flyer && event.flyer.big].filter(Boolean)
    return (
      <React.Fragment>
        <JsonLd data={{
          "@context": "http://schema.org",
          "@type": "Event",
          name: event.name,
          startDate: event.startAt.toISOString(),
          location: {
            "@type": "Place",
            name: event.location.name,
            address: {
              "@type": "PostalAddress",
              streetAddress: event.location.address,
              postalCode: event.location.zip,
              addressCountry: event.location.countryCode,
              addressLocality: event.location.city
            }
          },
          image: images,
          description: event.abstract,
          endDate: event.endAt.toISOString()
        }}/>
        <div className="main-menu__spacer"/>
        <div className="spacer"/>
        <Meta title={event.name} description={event.abstract || null}/>
        <Container variant="small">
          {editable && !editing && <div className="button" onClick={() => this.setState({editing: true})}>{t('edit')}</div>}
          {editing && (
            <React.Fragment>
              <div className="button" onClick={() => this.submit()}>{t('save')}</div>
              <p>{JSON.stringify(this.state.changes)}</p>
            </React.Fragment>
          )}
          <h2><Editable placeholder="Name" editable={editing} value={event.name} onChange={onChange('name')}/></h2>
          {(event.abstract || editing) && (<React.Fragment>
            <h4><Editable placeholder={t('.abstract')} editable={editing} value={event.abstract} onChange={onChange('abstract')}/></h4>
            <div className="spacer--small"/>
          </React.Fragment>)}
          {hero && <p><img src={hero}/></p>}
          <div className={`meta-box meta-box--${hero && 'floating'}`}>
            {
              meta.map(e => (
                <p key={e[0] as string}>
                  <strong>{e[0]}</strong><br/>
                  {e[2]}
                </p>
              ))
            }
            {loggedIn && <LikeButton active={!!liked} onClick={this.toggleLike}/> }
          </div>
          {event.description && format(event.description)}
          {flyer && <div className="flyer"><img src={flyer}/></div>}
          <h3>{locationDescription(event.location)}</h3>
          {coordinates && <Map center={coordinates} markerTitle={isVenue(event.location) ? event.location.name : undefined} zoom={isVenue(event.location) ? 16 : undefined}/>}
        </Container>
        {!!subevents.length && (
          <React.Fragment>
            <Container variant="small">
              <div className="spacer"/>
              <h2>{t('.happening_here', {location: event.location.name})}</h2>
              <div/>
            </Container>
            <Listing>{subevents.map(e => <EventListing key={e.id} event={e} />)}</Listing>
          </React.Fragment>
        ) }
        {!!otherEvents.length ? (
          <React.Fragment>
            <Container variant="small">
              <div className="spacer"/>
              <h2>{t('.other_events_in', {location: event.location.name})}</h2>
              <div/>
            </Container>
            <Listing>{otherEvents.map(e => <EventListing key={e.id} event={e} />)}</Listing>
          </React.Fragment>
        ) : <div className="spacer spacer--small" />}
      </React.Fragment>
    )
  }

  toggleLike = () => {
    const likes = writeDB.table('likes');
    const eventId= this.props.event!.id;
    if(this.props.liked) {
      likes.update(likes.where({eventId}), {state: 'deleted'});
    } else {
      likes.insert({eventId, state: 'pending'});
    }
  }

  private onChange<T extends keyof EventWithLocation>(field: T, type: string = 'string') {
    return (value: string) => {
      let convertedValue: any = value;
      if(type === 'date') {
        const timestamp = Date.parse(convertedValue);
        convertedValue = isNaN(timestamp) ? null : new Date(timestamp);
      }
      this.update({[field]: convertedValue});
    }
  }

  private update(values: Partial<Event>) {
    const changes = {...this.state.changes, ...values};
    const event = this.props.event!;
    Object.keys(changes).forEach(key => {
      if(changes[key] == event[key]) {
        delete(changes[key]);
      }
    });
    this.setState({changes});
  }

  private submit() {
    const {changes} = this.state;
    if(Object.keys(changes).length === 0) {
      this.setState({editing: false});
      return;
    }
    if(this.props.newEvent) {
      syncer.createEvent(this.props.event!.id, changes).then((event) => {
        this.props.history.push(`/events/${event.slug}`);
      });
    } else {
      syncer.updateEvent(this.props.event!.id, changes).then(() => {
        this.setState({changes: {}, editing: false});
      });
    }
  }
}

function buildEvent(): EventWithLocation {
  return {
    id: guid(),
    slug: '',
    name: 'New Event',
    startAt: new Date(),
    endAt: new Date(),
    locationId: '',
    locationSlug: 'change this',
    location: {
      id: '',
      slug: '',
      name: 'Change this',
      countryCode: 'de'
    }
  }
}

const mapStateToProps = (state: State, props) => {
  const slug: string = props.match.params.id;
  const db = new DB(state);
  const events = db.table('events');
  const newEvent = slug === 'new';
  let rawEvent = events.where({slug})[0];
  const session = db.get('session');
  const loggedIn = isLoggedIn(session);
  let event: EventWithLocation | undefined = newEvent ? buildEvent() : joinLocation(rawEvent ? [rawEvent] : [], state)[0];
  let subevents: EventWithLocation[] = event && !newEvent ? joinLocation(events.where({eventId: event.id}).filter(e => e.id != event!.id), state) : [];
  let otherEvents: EventWithLocation[] = event && !newEvent ? joinLocation(events.where({locationId: event.locationId}).filter(e => e.id != event!.id), state) : [];
  const editable = canEdit(event, session) || newEvent;
  const liked = rawEvent && isLiked(rawEvent, db.table('likes').all);
  return {event, liked, editable, otherEvents, newEvent, subevents, loggedIn};
}

export default connect(mapStateToProps)(withRouter(EventPage))
