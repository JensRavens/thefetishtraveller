import React from 'react';
import { Consumer } from '../form';
import { guid } from 'redux-database/dist/util';

interface Props {
  name: string;
  label?: string;
}

export class ImageInput extends React.Component<Props> {
  private id = guid();

  public render() {
    const { name, label } = this.props;
    const id = this.id;

    return (
      <div className="image-input">
        {label && (
          <label className="image-input__label" htmlFor={id}>
            {label}
          </label>
        )}
        <Consumer>
          {context => {
            return (
              <>
                <input
                  id={id}
                  type="file"
                  onChange={event =>
                    context!.notify(
                      name,
                      event.currentTarget.files && event.currentTarget.files[0]
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
