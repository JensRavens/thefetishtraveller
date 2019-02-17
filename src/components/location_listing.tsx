import React from 'react';
import { Location, countryName } from '../models/location';
import { Link } from 'react-router-dom';
import { t } from '@nerdgeschoss/i18n';

interface Props {
  location: Location;
}

export class LocationListing extends React.Component<Props> {
  public render() {
    const { location } = this.props;
    return (
      <Link to={`/locations/${location.slug}`} className="location-listing">
        <div className="location-listing__background" />
        <div className="location-listing__content">
          <div className="location-listing__category">
            {t(`location.category.${location.category}`)}
          </div>
          <div className="location-listing__name">{location.name}</div>
          <div className="location-listing__city">
            {location.city}, {countryName(location.countryCode)}
          </div>
        </div>
      </Link>
    );
  }
}
