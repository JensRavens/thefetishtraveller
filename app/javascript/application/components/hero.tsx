import * as React from 'react';

interface Props {
  backgroundImage?: string;
  style?: 'normal' | 'expanded';
}

export default class Hero extends React.Component<Props> {
  static defaultProps = { style: 'normal' };

  render() {
    const { backgroundImage, children, style } = this.props;
    return (
      <div className={`hero hero--${style}`}>
        {backgroundImage && (
          <div
            className="hero__background"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        <div className="hero__content">{children}</div>
      </div>
    );
  }
}
