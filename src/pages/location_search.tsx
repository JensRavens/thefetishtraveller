import React, { useState } from 'react';
import { matchesTerm } from '../models/location';
import { LocationListing } from '../components/location_listing';
import Hero from '../components/hero';
import Listing from '../components/listing';
import { Form } from '../components/form';
import { TextInput } from '../components/input/text-input';
import { scoped } from '@nerdgeschoss/i18n';
import { gql, useQuery } from '@apollo/client';
import { AllLocationsQuery } from '../generated/AllLocationsQuery';

const t = scoped('locationSearch');

const LOCATIONS = gql`
  query AllLocationsQuery {
    locations {
      nodes {
        id
        name
        slug
        category
        city
        countryName
      }
    }
  }
`;

export default function LocationSearch(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, error } = useQuery<AllLocationsQuery>(LOCATIONS);
  if (error) {
    console.log(error);
  }
  let locations = (data && data.locations.nodes) || [];
  if (searchTerm) {
    locations = locations.filter(e => matchesTerm(e, searchTerm));
  } else {
    locations = locations.filter(e => e.category === 'city');
  }
  locations.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <React.Fragment>
      <Hero>
        <h1>Locations</h1>
        <div className="hero__addon">
          <Form
            model={{ searchTerm }}
            onInput={value => setSearchTerm(value.searchTerm)}
          >
            <TextInput
              name="searchTerm"
              type="search"
              placeholder={t('.search_place_holder')}
            />
          </Form>
        </div>
      </Hero>
      <Listing>
        {locations.map(e => (
          <LocationListing key={e.id} location={e} />
        ))}
      </Listing>
    </React.Fragment>
  );
}
