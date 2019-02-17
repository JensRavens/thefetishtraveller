import React from 'react';

export class EventSubmit extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <div className="spacer spacer--for-navbar spacer--no-margin" />
        <iframe
          style={{ border: 'none', width: '100%', height: '100vh' }}
          src="https://docs.google.com/forms/d/e/1FAIpQLScnMJs_-gi_XyRm2ptfP42rd9lvRJREd3e6VlkpdFMNqwpiaA/viewform?usp=sf_link"
        />
      </React.Fragment>
    );
  }
}
