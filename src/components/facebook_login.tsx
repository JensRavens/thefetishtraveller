import React from 'react';
import { connect } from 'react-redux';

import { APISession } from '../api';
import { State } from '../state';

interface Props {
  session?: APISession;
}

class FacebookLogin extends React.Component<Props> {
  public render() {
    return (
      <div
        className="fb-login-button"
        data-max-rows="1"
        data-size="medium"
        data-button-type="continue_with"
        data-show-faces="false"
        data-auto-logout-link="true"
        data-use-continue-as="true"
        data-scope="public_profile,email"
      />
    );
  }

  public componentDidMount() {
    const id = 'facebook-jssdk';
    const fjs = document.getElementsByTagName('script')[0];
    if (document.getElementById(id)) {
      return;
    }
    const js = document.createElement('script');
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode!!.insertBefore(js, fjs);
  }
}

const mapStateToProps: (state: State) => Props = state => {
  return { session: state.settings.session };
};

export default connect(mapStateToProps)(FacebookLogin);
