import React from 'react';
import { connect } from 'react-redux';
import marked from 'marked';
import { withRouter, RouteComponentProps } from 'react-router';
import {
  extractCoordinates,
  isVenue,
  Location,
  countryName,
} from '../models/location';
import { DB, State } from '../state';
import Container from '../components/container';
import { Meta } from '../components/meta';
import { Map } from '../components/map';
import { scoped } from '@nerdgeschoss/i18n';
import Listing from '../components/listing';
import { LocationListing } from '../components/location_listing';
import { EventWithLocation } from '../models/event';
import { EventListing } from '../components/event_listing';

interface Props {
  location?: Location;
  relatedLocations: Location[];
  events: EventWithLocation[];
}

const t = scoped('location');

function format(text: string): React.ReactNode {
  return <div dangerouslySetInnerHTML={{ __html: text ? marked(text) : '' }} />;
}

class LocationPage extends React.Component<Props> {
  public render() {
    const { location, relatedLocations, events } = this.props;
    if (!location) {
      return null;
    }
    const coordinates = extractCoordinates(location);
    const meta = [
      [t('.city'), location.city],
      [t('.country'), countryName(location.countryCode)],
    ].filter(e => e[1]);
    return (
      <>
        <div className="main-menu__spacer" />
        <div className="spacer" />
        <Meta title={location.name} />
        <Container variant="small">
          <h2>{location.name}</h2>
          {location.abstract && (
            <>
              <h4>{location.abstract}</h4>
              <div className="spacer--small" />
            </>
          )}
          <div className={`meta-box meta-box--${false && 'floating'}`}>
            {meta.map(e => (
              <p key={e[0] as string}>
                <strong>{e[0]}</strong>
                <br />
                {e[1]}
              </p>
            ))}
          </div>
          {location.description && format(location.description)}
          {coordinates && (
            <Map
              center={coordinates}
              zoom={isVenue(location) ? 16 : undefined}
            />
          )}
        </Container>
        {!!relatedLocations.length && (
          <>
            <Container variant="small">
              <div className="spacer" />
              <h2>{t('.locations_in', { name: location.name })}</h2>
              <div />
            </Container>
            <Listing>
              {relatedLocations.map(e => (
                <LocationListing key={e.id} location={e} />
              ))}
            </Listing>
          </>
        )}
        {!!events.length ? (
          <React.Fragment>
            <Container variant="small">
              <div className="spacer" />
              <h2>{t('.events_in', { name: location.name })}</h2>
              <div />
            </Container>
            <Listing>
              {events.map(e => (
                <EventListing key={e.id} event={e} />
              ))}
            </Listing>
          </React.Fragment>
        ) : (
          <div className="spacer spacer--small" />
        )}
      </>
    );
  }
}

function mapStateToProps(
  state: State,
  props: RouteComponentProps<{ id: string }>
): Props {
  const slug = props.match.params.id;
  const db = new DB(state);
  const locations = db.context('local').table('locations');
  const location = locations.where({ slug })[0];
  const relatedLocations = location
    ? db
        .table('locations')
        .where({ city: location.name })
        .filter(e => e.id !== location.id)
    : [];
  const events = location
    ? db
        .table('events')
        .where({ locationId: location.id })
        .map(e => ({
          ...e,
          location: db.table('locations').find(e.locationId)!,
        }))
        .filter(e => e.location)
    : [];
  return {
    location,
    relatedLocations,
    events,
  };
}

export default withRouter(connect(mapStateToProps)(LocationPage));
