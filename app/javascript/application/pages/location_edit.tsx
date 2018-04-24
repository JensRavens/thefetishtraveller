import * as React from 'react';
import {connect} from 'react-redux';
import {Location} from '../models/location';
import {DB, DBAction, writeDB} from '../state';
import Container from '../components/container';
import Form from '../components/form';
import FormField from '../components/form_field';
import {dateRange} from '../util';

interface Props {
  id: string;
  location?: Location;
  dispatch: (DBAction) => void;
}

const locations = writeDB.table('locations');

class LocationEdit extends React.Component<Props> {
  render() {
    let {location,dispatch} = this.props;
    if(!location) { return null };
    return (
      <Container>
        <h1>{location.name}</h1>
        <Form model={location} onChange={(model) => this.update(model)} onSubmit={(model) => this.submit(model)}>
          <FormField name="name"/>
          <FormField name="city"/>
          <input type="submit"/>
        </Form>
      </Container>
    )
  }

  private update(values: Partial<Location>) {
    this.props.dispatch(locations.update(this.props.location.id, values));
  }

  private submit(values: Partial<Location>) {
    this.props.dispatch(locations.update(this.props.location.id, {fieldsToSync: Object.keys(values)}));
  }
}

const mapStateToProps = (state, props) => {
  const id = props.match.params.id;
  const db = new DB(state);
  return {location: db.table('locations').find(id), id};
}

export default connect(mapStateToProps)(LocationEdit)
