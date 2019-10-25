import React, { useRef } from 'react';
import { Consumer } from '../form';
import { guid } from '../../util';

interface Props {
  name: string;
  label?: string;
}

export function Checkbox({ name, label }: Props): JSX.Element {
  const id = useRef(guid()).current;
  return (
    <div className="checkbox">
      {label && (
        <label className="checkbox__label" htmlFor={id}>
          {label}
        </label>
      )}
      <Consumer>
        {context => {
          const checked: boolean | undefined = context!.model[name];
          return (
            <>
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={event =>
                  context!.notify(name, event.currentTarget.checked)
                }
              />
            </>
          );
        }}
      </Consumer>
    </div>
  );
}
