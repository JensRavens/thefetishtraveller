import * as React from 'react';
import Form, { Context } from './form';

interface Props {
  name: string;
  options: string[][];
}

export default class Select extends React.Component<Props> {
  render() {
    const { name, options } = this.props;
    return (
      <Context.Consumer>
        {form => (
          <select name={name} onChange={() => form.change()}>
            {options.map(key => (
              <option key={key[0]} value={key[0]}>
                {key[1]}
              </option>
            ))}
          </select>
        )}
      </Context.Consumer>
    );
  }
}
