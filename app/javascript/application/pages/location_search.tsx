import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';
import {Location} from '../models/location';
import {LocationListing} from '../components/location_listing';
import Container from '../components/container';
import Hero from '../components/hero';

interface Props {
  locations: Location[];
}

const mapStateToProps: (state: State) => Props = (state) => {
  return {
    locations: new DB(state).table('locations').all
  }
}

class LocationSearch extends React.Component<Props> {
  render() {
    const {locations} = this.props;
    return (
      <React.Fragment>
        <Hero>
          <h1>Locations</h1>
        </Hero>
        <Container>
          {locations.map(e => <LocationListing key={e.id} location={e} />)}
        </Container>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(LocationSearch);
