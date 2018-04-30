import * as React from 'react';
import {connect} from 'react-redux';
import {Location} from '../models/location';
import {DB, DBAction, writeDB} from '../state';
import Container from '../components/container';
import Form from '../components/form';
import Hero from '../components/hero';
import Editable from '../components/editable';
import FormField from '../components/form_field';
import {dateRange} from '../util';
import {syncer} from '../api-syncer';

interface Props {
  id: string;
  location?: Location;
  dispatch: (DBAction) => void;
}

interface State {
  changes: Partial<Location>;
}

const locations = writeDB.table('locations');

class LocationEdit extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  state = {
    changes: {}
  };

  render() {
    let {location,dispatch} = this.props;
    if(!location) { return null };
    location = {...location, ...this.state.changes};
    const hasChanges = Object.keys(this.state.changes).length > 0;
    const onChange = this.onChange;
    return (
      <React.Fragment>
        <Hero>
          <h1><Editable placeholder="Name" value={location.name} onChange={onChange('name')}/></h1>
          <div className="hero__addon">
            <Editable placeholder="City" value={location.city} onChange={onChange('city')}/>, <Editable placeholder="Country Code" onChange={onChange('countryCode')} value={location.countryCode}/>, <Editable placeholder="Slug" value={location.slug} onChange={onChange('slug')}/>
          </div>
        </Hero>
        <div className="spacer spacer--small"/>
        <Container>
          <h3>Address</h3>
          <p>
            <Editable placeholder="Latitude" value={location.lat} onChange={(value) => this.update({lat: parseFloat(value)})}/>, <Editable placeholder="Longitude" value={location.lon} onChange={(value) => this.update({lon: parseFloat(value)})}/>
          </p>
          <p>
            <Editable placeholder="Address" value={location.address} onChange={onChange('address')}/><br/>
            <Editable placeholder="Zip Code" value={location.zip} onChange={onChange('zip')}/>
          </p>
          {hasChanges && <div className="button" onClick={() => this.submit()}>Save</div>}
        </Container>
        <div className="spacer"/>
      </React.Fragment>
    )
  }

  private onChange<T extends keyof Location>(field: T) {
    return (value: string) => this.update({[field]: value});
  }

  private update(values: Partial<Location>) {
    const changes = {...values};
    const location = this.props.location!;
    Object.keys(changes).forEach(key => {
      if(changes[key] == location[key]) {
        delete(changes[key]);
      }
    });
    this.setState({changes});
  }

  private submit() {
    syncer.updateLocation(this.props.id, this.state.changes).then(() => this.setState({changes: {}}));
  }
}

const mapStateToProps = (state, props) => {
  const id = props.match.params.id;
  const db = new DB(state);
  return {location: db.table('locations').where({slug: id})[0], id};
}

export default connect(mapStateToProps)(LocationEdit)
