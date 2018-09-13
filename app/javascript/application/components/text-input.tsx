import * as React from 'react';
import Form, { Context } from './form';
import FormField from './form_field';

interface Props {
  name: string;
  type?: 'text' | 'search';
  placeholder?: string;
}

export default class TextInput extends React.Component<Props> {
  render() {
    const { type } = this.props;
    return (
      <div className={`text-input text-input--${type || 'text'}`}>
        <FormField {...this.props} />
      </div>
    );
  }
}
