import * as React from 'react';
import AirbrakeClient from 'airbrake-js';
import { withRouter } from 'react-router';

import Hero from './hero';
import Container from './container';

interface Props {
  location: {
    pathname: string;
  };
}

interface State {
  hasError: boolean;
}

class ErrorCatcher extends React.Component<Props, State> {
  state = { hasError: false };

  private airbrake? = process.env.AIRBRAKE_PROJECT_ID
    ? new AirbrakeClient({
        projectId: process.env.AIRBRAKE_PROJECT_ID,
        projectKey: process.env.AIRBRAKE_API_KEY,
      })
    : undefined;

  componentDidCatch(error: Error, info: any) {
    this.setState({ hasError: true });
    this.airbrake &&
      this.airbrake.notify({
        error: error,
        params: { info: info },
      });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ hasError: false });
    }
  }

  render() {
    (window as any).airbrake = this.airbrake;
    if (this.state.hasError) {
      return (
        <Hero>
          <Container>
            <h1>Something went wrong.</h1>
            <div className="hero__addon">
              <h5>
                Sadly we encountered an error in this page. The administrator
                has been notified and we try to fix it as soon as possible.
              </h5>
            </div>
          </Container>
        </Hero>
      );
    }
    return this.props.children;
  }
}

export default withRouter(ErrorCatcher);
