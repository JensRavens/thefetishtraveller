import React from 'react';

interface Props {
  data: { [key: string]: any };
}

export class JsonLd extends React.Component<Props> {
  public render() {
    const { data } = this.props;
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  }
}
