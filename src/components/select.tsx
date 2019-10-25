import React from 'react';
import { Consumer } from './form';
import { guid } from '../util';
import SelectElement from 'react-select';

interface Props {
  name: string;
  label?: string;
  options: Array<{ value: string; label: string }>;
  multi?: boolean;
}

export default class Select extends React.Component<Props> {
  private id = guid();
  public render() {
    const { name, label, options, multi } = this.props;
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
              isMulti={multi}
              name={name}
              value={
                multi
                  ? options.filter(e =>
                      ((form!.model[name] as string[]) || []).includes(e.value)
                    )
                  : options.find(e => e.value === form!.model[name])
              }
              onChange={option => {
                form!.notify(
                  name,
                  multi ? (option as any[]).map(e => e.value) : option!['value']
                );
              }}
              options={options}
            ></SelectElement>
          </div>
        )}
      </Consumer>
    );
  }
}
