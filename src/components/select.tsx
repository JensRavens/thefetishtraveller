import React from 'react';
import { Consumer } from './form';

interface Props {
  name: string;
  options: string[][];
}

export default class Select extends React.Component<Props> {
  public render() {
    const { name, options } = this.props;
    return (
      <Consumer>
        {form => (
          <select
            name={name}
            onChange={event => form!.notify(name, event.target.value)}
          >
            {options.map(key => (
              <option key={key[0]} value={key[0]}>
                {key[1]}
              </option>
            ))}
          </select>
        )}
      </Consumer>
    );
  }
}
