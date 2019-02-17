import React from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  title?: string | null;
  description?: string | null;
}

export class Meta extends React.Component<Props> {
  public render() {
    const { title, description } = this.props;
    return (
      <Helmet>
        {title !== undefined && (
          <title>
            {title ? title + ' | ' : ''}
            The Fetish Traveller
          </title>
        )}
        {description !== undefined && (
          <meta name="description" content={description || ''} />
        )}
      </Helmet>
    );
  }
}
