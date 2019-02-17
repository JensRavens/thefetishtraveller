import React from 'react';
import { Consumer } from '../form';
import { guid } from '../../util';

interface Props {
  name: string;
  label?: string;
}

function localTimeString(date: Date): string {
  const ten = (i: number) => {
    return (i < 10 ? '0' : '') + i;
  };
  const YYYY = date.getFullYear();
  const MM = ten(date.getMonth() + 1);
  const DD = ten(date.getDate());
  const HH = ten(date.getHours());
  const II = ten(date.getMinutes());
  const SS = ten(date.getSeconds());

  return YYYY + '-' + MM + '-' + DD + 'T' + HH + ':' + II + ':' + SS;
}

export class DateTimeInput extends React.Component<Props> {
  private id = guid();
  public render() {
    const { name, label } = this.props;
    const id = this.id;
    return (
      <div className="datetime-input">
        {label && (
          <label className="image-input__label" htmlFor={id}>
            {label}
          </label>
        )}
        <Consumer>
          {context => {
            const date: Date | undefined = context!.model[name];
            const dateString = (date && localTimeString(date)) || '';
            return (
              <>
                <input
                  id={id}
                  type="datetime-local"
                  value={dateString}
                  onChange={event =>
                    context!.notify(
                      name,
                      new Date(Date.parse(event.currentTarget.value))
                    )
                  }
                />
              </>
            );
          }}
        </Consumer>
      </div>
    );
  }
}
