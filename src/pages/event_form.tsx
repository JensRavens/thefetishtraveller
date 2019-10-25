import React from 'react';
import { pick } from 'lodash';

import { EventWithLocation } from '../models/event';
import { Form } from '../components/form';
import { TextInput } from '../components/input/text-input';
import { writeDB } from '../state';
import { ImageInput } from '../components/input/image-input';
import { readImageUrl } from '../models/image';
import { DateTimeInput } from '../components/input/datetime-input';
import { t } from '@nerdgeschoss/i18n';
import Select from '../components/select';
import { Location, locationDescription } from '../models/location';

interface Props {
  event: EventWithLocation;
  possibleLocations: Location[];
}

export class EventForm extends React.Component<Props> {
  public render() {
    const { event, possibleLocations } = this.props;
    return (
      <Form model={event} onInput={this.onChange}>
        <TextInput name="name" label={t('event.name')} />
        <TextInput name="website" label={t('event.website')} />
        <TextInput name="ticketLink" label={t('event.ticketLink')} />
        <TextInput name="organizerName" label={t('event.organizerName')} />
        <Select
          name="locationId"
          label={t('event.locationId')}
          options={possibleLocations.map(e => ({
            value: e.id,
            label: locationDescription(e),
          }))}
        />
        <TextInput
          name="abstract"
          type="multiline"
          label={t('event.abstract')}
        />
        <TextInput
          name="description"
          type="multiline"
          label={t('event.description')}
        />
        <DateTimeInput name="startAt" label={t('event.startAt')} />
        <DateTimeInput name="endAt" label={t('event.endAt')} />
        <ImageInput name="hero" label={t('event.hero')} />
        <ImageInput name="header" label={t('event.header')} />
        <ImageInput name="flyer" label={t('event.flyer')} />
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
        'locationId',
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
