import * as React from 'react';
import {Helmet} from 'react-helmet';
import {compact} from 'lodash';

interface Props {
  title?: string | null;
}

export class Meta extends React.Component<Props> {
  render() {
    const {title} = this.props;
    return (
      <Helmet>
        {title !== undefined && <title>{title ? title + ' | ' : '' }The Fetish Traveller</title>}
      </Helmet>
    )
  }
}
