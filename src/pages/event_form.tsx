import React from 'react';
import { pick } from 'lodash';

import { EventWithLocation } from '../models/event';
import { Form } from '../components/form';
import TextInput from '../components/text-input';
import { writeDB } from '../state';
import { ImageInput } from '../components/image-input';
import { readImageUrl } from '../models/image';
import { DateTimeInput } from '../components/datetime-input';

interface Props {
  event: EventWithLocation;
}

export class EventForm extends React.Component<Props> {
  public render() {
    const { event } = this.props;
    return (
      <Form model={event} onInput={this.onChange}>
        <TextInput name="name" />
        <TextInput name="website" />
        <TextInput name="ticketLink" />
        <TextInput name="organizerName" />
        <TextInput name="abstract" type="multiline" />
        <TextInput name="description" type="multiline" />
        <DateTimeInput name="startAt" />
        <DateTimeInput name="endAt" />
        <ImageInput name="hero" />
        <ImageInput name="header" />
        <ImageInput name="flyer" />
      </Form>
    );
  }

  private onChange = async (event: EventWithLocation) => {
    const eventBeforeChange = this.props.event;
    const hero =
      event.hero instanceof File ? await readImageUrl(event.hero) : event.hero;
    const header =
      event.header instanceof File
        ? await readImageUrl(event.header)
        : event.header;
    const flyer =
      event.flyer instanceof File
        ? await readImageUrl(event.flyer)
        : event.flyer;
    const eventChanges = {
      ...pick(
        event,
        'name',
        'abstract',
        'description',
        'website',
        'ticketLink',
        'organizerName',
        'startAt',
        'endAt'
      ),
      hero,
      header,
      flyer,
    };
    Object.keys(eventChanges).forEach(key => {
      if (eventBeforeChange[key] === eventChanges[key]) {
        delete eventChanges[key];
      }
    });
    writeDB
      .context('local')
      .table('events')
      .update(this.props.event.id, eventChanges);
  };
}
