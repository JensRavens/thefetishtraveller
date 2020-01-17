import React, { useEffect } from 'react';

export default function FacebookLogin(): JSX.Element {
  useEffect(() => {
    const id = 'facebook-jssdk';
    const fjs = document.getElementsByTagName('script')[0];
    if (document.getElementById(id)) {
      return;
    }
    const js = document.createElement('script');
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode!!.insertBefore(js, fjs);
  }, []);
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
