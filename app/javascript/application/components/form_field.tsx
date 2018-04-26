import * as React from 'react';
import Form, {Context} from './form';

interface Props {
  name: string;
  type?: 'text' | 'search';
  placeholder?: string;
}

export default class FormField extends React.Component<Props> {
  render() {
    const {name, type, placeholder} = this.props;
    return (
      <Context.Consumer>
        {(form) => {
          return <input type={type || 'text'} placeholder={placeholder} value={form.valueForName(name) || ''} name={name} onChange={() => form.change()}/>;
        }}
      </Context.Consumer>
    )
  }
}
