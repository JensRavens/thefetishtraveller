import React from 'react';
import { connect } from 'react-redux';

import { DB, State } from '../state';
import { Location, matchesTerm } from '../models/location';
import { LocationListing } from '../components/location_listing';
import Hero from '../components/hero';
import Listing from '../components/listing';
import { Form } from '../components/form';
import { TextInput } from '../components/input/text-input';
import { scoped } from '@nerdgeschoss/i18n';

const t = scoped('locationSearch');

interface Props {
  locations: Location[];
}

interface ComponentState {
  searchTerm?: string;
}

const mapStateToProps: (state: State) => Props = state => {
  return {
    locations: new DB(state).table('locations').all,
  };
};

class LocationSearch extends React.Component<Props, ComponentState> {
  public state: ComponentState = {};

  public render() {
    const { searchTerm } = this.state;
    let { locations } = this.props;
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
            <Form model={this.state} onInput={value => this.setState(value)}>
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
}

export default connect(mapStateToProps)(LocationSearch);
