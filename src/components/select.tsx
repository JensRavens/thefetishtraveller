import React from 'react';
import { Consumer } from './form';
import { sortBy } from 'lodash';
import { guid } from '../util';

interface Props {
  name: string;
  label?: string;
  options: Array<[string, string]>;
}

export default class Select extends React.Component<Props> {
  private id = guid();
  public render() {
    const { name, label } = this.props;
    const id = this.id;
    const options = sortBy(this.props.options, a => a[1]);
    return (
      <Consumer>
        {form => (
          <div className="select">
            {label && (
              <label className="select__label" htmlFor={id}>
                {label}
              </label>
            )}
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
          </div>
        )}
      </Consumer>
    );
  }
}
