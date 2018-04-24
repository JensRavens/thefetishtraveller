import * as React from 'react';

interface Props {
  backgroundImage?: string;
  style?: 'normal' | 'expanded';
}

export default class Hero extends React.Component<Props> {
  static defaultProps = { style: 'normal' }

  render() {
    const {backgroundImage, children, style} = this.props;
    const css = {};
    if(backgroundImage) { css['backgroundImage'] = `url(${backgroundImage})`; }
    return (
      <div className={`hero hero--${style}`} style={css}>{children}</div>
    )
  }
}
