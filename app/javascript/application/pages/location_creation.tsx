import * as React from 'react';
import {connect} from 'react-redux';
import {Event} from '../models/event';
import {Location} from '../models/location';
import {DB, DBAction, State, writeDB} from '../state';
import Container from '../components/container';
import Form from '../components/form';
import FormField from '../components/form_field';
import {dateRange, guid} from '../util';

interface Props {
  state: State;
  dispatch: (DBAction) => void;
}

const locations = writeDB.table('locations');

class LocationCreation extends React.Component<Props> {
  id: string;

  render() {
    const {dispatch, state} = this.props;
    const db = new DB(state);
    let location = db.table("locations").find(this.id)!;
    if(!this.id) {
      this.id = guid();
      location = {id: this.id, draft: true} as Location;
      db.table('locations').insert(location)
    }
    return (
      <Container>
        <h1>{location.name || "New Location"}</h1>
        <Form model={location} onChange={(model) => this.update(model)} onSubmit={(model) => this.submit(model)}>
          <FormField name="name"/>
          <FormField name="city"/>
          <FormField name="address"/>
          <FormField name="zip"/>
          <FormField name="countryCode"/>
          <input type="submit"/>
        </Form>
      </Container>
    )
  }

  private update(values: Partial<Location>) {
    this.props.dispatch(locations.update(this.id, values));
  }

  private submit(values: Partial<Location>) {
    this.props.dispatch(locations.update(this.id, {draft: false}));
  }
}

const mapStateToProps = (state, props) => {
  return {state};
}

export default connect(mapStateToProps)(LocationCreation)
