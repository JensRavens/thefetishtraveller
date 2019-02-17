import React from 'react';
import { Consumer } from './form';

interface Props {
  name: string;
  type?: 'text' | 'search' | 'multiline';
  placeholder?: string;
}

export default class TextInput extends React.Component<Props> {
  public render() {
    const { type, name, placeholder } = this.props;
    return (
      <div className={`text-input text-input--${type || 'text'}`}>
        <Consumer>
          {context => (
            <>
              {type === 'multiline' && (
                <textarea
                  value={context!.model[name]}
                  onChange={event =>
                    context!.notify(name, event.currentTarget.value)
                  }
                  placeholder={placeholder}
                />
              )}
              {type !== 'multiline' && (
                <input
                  value={context!.model[name]}
                  onChange={event =>
                    context!.notify(name, event.currentTarget.value)
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
