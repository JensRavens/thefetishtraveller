import React from 'react';
import { Consumer } from './form';

interface Props {
  name: string;
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
  public render() {
    const { name } = this.props;
    return (
      <div className="datetime-input">
        <Consumer>
          {context => {
            const date: Date | undefined = context!.model[name];
            const dateString = (date && localTimeString(date)) || '';
            return (
              <>
                <input
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
