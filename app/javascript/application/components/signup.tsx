import * as React from 'react';

export class Signup extends React.Component {
  render() {
    return (
      <div className="signup">
        <form action="https://thefetishtraveller.us18.list-manage.com/subscribe/post?u=aa4a99bda25e9aef2aeaf325a&amp;id=d7a07e0791" method="post" target="_blank" className="signup__container">
          <input type="email" name="EMAIL" required className="signup__email" placeholder="Stay in touch, subscribe to our newsletter"/>
          <input type="submit" value="Subscribe" className="signup__button"/>
        </form>
      </div>
    )
  }
}
