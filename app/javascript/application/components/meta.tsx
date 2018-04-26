import * as React from 'react';
import {Helmet} from 'react-helmet';
import {compact} from 'lodash';

interface Props {
  title?: string;
}

export class Meta extends React.Component<Props> {
  render() {
    const {title} = this.props;
    return (
      <Helmet>
        {this.props.title && <title>{title} | The Fetish Traveller</title>}
      </Helmet>
    )
  }
}
