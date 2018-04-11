import * as React from 'react';
import {Event} from '../models/event';

interface Props {
  event: Event;
}

export class EventListing extends React.Component<Props> {
  render() {
    return (
      <div>Event {this.props.event.name}.</div>
    )
  }
}
