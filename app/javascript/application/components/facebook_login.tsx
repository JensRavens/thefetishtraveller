import * as React from 'react';
import { connect } from 'react-redux';

import { APISession } from '../api';
import { State } from '../state';
import { isLoggedIn } from '../models/session';

interface Props {
  session?: APISession;
}

class FacebookLogin extends React.Component<Props> {
  render() {
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

  componentDidMount() {
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode!!.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }
}

const mapStateToProps: (state: State) => Props = state => {
  return { session: state.settings.session };
};

export default connect(mapStateToProps)(FacebookLogin);
