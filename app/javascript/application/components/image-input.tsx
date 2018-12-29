import * as React from 'react';
import { Consumer } from './form';

interface Props {
  name: string;
}

export class ImageInput extends React.Component<Props> {
  public render() {
    const { name } = this.props;

    return (
      <div className="image-input">
        <Consumer>
          {context => {
            let currentFile: File | undefined = context.model[name];
            let currentUrl: string | undefined;
            if (typeof currentFile === 'string') {
              currentUrl = currentFile;
              currentFile = undefined;
            }
            return (
              <>
                <img src={currentUrl} alt="" />
                <input
                  type="file"
                  onChange={event =>
                    context.notify(
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
