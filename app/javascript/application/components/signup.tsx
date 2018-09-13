import * as React from 'react';
import { scoped } from '../i18n';

const t = scoped('newsletter');

export class Signup extends React.Component {
  render() {
    return (
      <div className="signup">
        <form
          action="https://thefetishtraveller.us18.list-manage.com/subscribe/post?u=aa4a99bda25e9aef2aeaf325a&amp;id=d7a07e0791"
          method="post"
          target="_blank"
          className="signup__container"
        >
          <input
            type="email"
            name="EMAIL"
            required
            className="signup__email"
            placeholder={t('.cto')}
          />
          <input
            type="submit"
            value={t('.subscribe')}
            className="signup__button"
          />
        </form>
      </div>
    );
  }
}
