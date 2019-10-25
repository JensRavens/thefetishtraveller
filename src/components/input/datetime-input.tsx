import React, { useState, useRef } from 'react';
import { Consumer } from '../form';
import { guid } from '../../util';

interface Props {
  name: string;
  displayTime?: boolean;
  label?: string;
}

function localTimeString(date: Date, time: boolean): string {
  const ten = (i: number) => {
    return (i < 10 ? '0' : '') + i;
  };
  const YYYY = date.getFullYear();
  const MM = ten(date.getMonth() + 1);
  const DD = ten(date.getDate());

  var string = YYYY + '-' + MM + '-' + DD;
  if (time) {
    const HH = ten(date.getHours());
    const II = ten(date.getMinutes());
    const SS = ten(date.getSeconds());
    string += 'T' + HH + ':' + II + ':' + SS;
  }
  return string;
}

export function DateTimeInput({
  name,
  label,
  displayTime,
}: Props): JSX.Element {
  const id = useRef(guid()).current;
  let [value, setValue] = useState<string | undefined>(undefined);
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
          const dateString =
            value || (date && localTimeString(date, !!displayTime)) || '';
          return (
            <>
              <input
                id={id}
                type={displayTime ? 'datetime-local' : 'date'}
                value={dateString}
                onChange={event => {
                  let dateString = event.currentTarget.value;
                  let timestamp = Date.parse(dateString);
                  if (isNaN(timestamp)) {
                    setValue(dateString);
                  } else {
                    setValue(undefined);
                    context!.notify(name, new Date(timestamp));
                  }
                }}
              />
            </>
          );
        }}
      </Consumer>
    </div>
  );
}
