import React from 'react';
import { Consumer } from './form';
import { guid } from '../util';
import SelectElement from 'react-select';

interface Props {
  name: string;
  label?: string;
  options: Array<{ value: string; label: string }>;
}

export default class Select extends React.Component<Props> {
  private id = guid();
  public render() {
    const { name, label, options } = this.props;
    const id = this.id;
    return (
      <Consumer>
        {form => (
          <div className="select">
            {label && (
              <label className="select__label" htmlFor={id}>
                {label}
              </label>
            )}
            <SelectElement
              name={name}
              value={options.find(e => e.value === form!.model[name])}
              onChange={option => form!.notify(name, option!['value'])}
              options={options}
            ></SelectElement>
          </div>
        )}
      </Consumer>
    );
  }
}
