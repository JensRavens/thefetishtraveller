import * as React from 'react';
import {connect} from 'react-redux';
import {Event, loadEvent} from '../models/event';
import {DB, DBAction} from '../state';
import {api} from '../api';
import Container from '../components/container';
import Form from '../components/form';
import FormField from '../components/form_field';
import {dateRange} from '../util';

interface Props {
  id: string;
  event?: Event;
  dispatch: (DBAction) => void;
}

class EventEdit extends React.Component<Props> {
  componentDidMount() {
    if(!this.props.event) {
      loadEvent(this.props.id);
    }
  }

  render() {
    let {event,dispatch} = this.props;
    if(!event) { return null };
    return (
      <Container>
        <h1>{event.name}</h1>
        <Form model={event} onChange={(model) => this.update(model)} onSubmit={(model) => this.submit(model)}>
          <FormField name="name"/>
          <FormField name="organizerName"/>
          <FormField name="website"/>
          <input type="submit"/>
        </Form>
      </Container>
    )
  }

  private update(values: Partial<Event>) {
    this.props.dispatch(new DB().table('events').update(this.props.event.id, values));
  }

  private submit(values: Partial<Event>) {
    console.log('submitting', values, {id: this.props.id, ...values});
    api.updateEvent({id: this.props.id, ...values});
  }
}

const mapStateToProps = (state, props) => {
  const id = props.match.params.id;
  const db = new DB(state);
  return {event: db.table('events').find(id), id};
}

export default connect(mapStateToProps)(EventEdit)