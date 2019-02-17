import React from 'react';
import { Consumer } from '../form';
import { guid } from '../../util';

interface Props {
  name: string;
  type?: 'text' | 'search' | 'multiline';
  placeholder?: string;
  label?: string;
}

function presence(value?: string): string | undefined {
  if (value && value.length > 0) {
    return value;
  }
  return undefined;
}

export class TextInput extends React.Component<Props> {
  private id = guid();

  public render() {
    const { type, name, placeholder, label } = this.props;
    const id = this.id;
    return (
      <div className={`text-input text-input--${type || 'text'}`}>
        {label && (
          <label className="text-input__label" htmlFor={id}>
            {label}
          </label>
        )}
        <Consumer>
          {context => (
            <>
              {type === 'multiline' && (
                <textarea
                  id={id}
                  value={context!.model[name] || ''}
                  onChange={event =>
                    context!.notify(name, presence(event.currentTarget.value))
                  }
                  placeholder={placeholder}
                />
              )}
              {type !== 'multiline' && (
                <input
                  id={id}
                  value={context!.model[name] || ''}
                  onChange={event =>
                    context!.notify(name, presence(event.currentTarget.value))
                  }
                  placeholder={placeholder}
                />
              )}
            </>
          )}
        </Consumer>
      </div>
    );
  }
}
