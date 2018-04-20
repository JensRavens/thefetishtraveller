import * as React from 'react';
import Form, {Context} from './form';

interface Props {
  name: string;
}

export default class FormField extends React.Component<Props> {
  render() {
    const {name} = this.props;
    return (
      <Context.Consumer>
        {(form) => {
          return <input type="text" value={form.valueForName(name) || ''} name={name} onChange={() => form.change()} placeholder={name}/>;
        }}
      </Context.Consumer>
    )
  }
}
