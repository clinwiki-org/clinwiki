import React from 'react';
import { createMemoryHistory } from 'history';
import { shallow } from 'enzyme';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import AuthButton from '../index';

describe('<AuthButton />', () => {
  describe('if the user is not logged in', () => {
    const rendered = shallow(
      <AuthButton
        user={{ loggedIn: false }}
        history={createMemoryHistory('/')}
      />
    );
    it('should render a button linking to the login page', () => {
      expect(rendered.contains(<Button className="pull-right" href="/login-signup">Login | Signup</Button>)).toBe(true);
    });
  });
  describe('if the user is logged in', () => {
    const history = createMemoryHistory('/');
    const rendered = shallow(
      <AuthButton
        user={{ email: 'foo@bar.com', loggedIn: true }}
        history={history}
      />
    );
    it('should render a dropdown button with the email as the title', () => {
      const found = rendered.find(DropdownButton);
      expect(found.length).toEqual(1);
      expect(found.get(0).props.title).toEqual('foo@bar.com');
    });
    it('should provide an affordance to click on the profile page', () => {
      const found = rendered.find(MenuItem);
      expect(found.length).toEqual(2);
      expect(found.at(0).children().text()).toEqual('Profile');
      found.at(0).simulate('click');
      expect(history.location.pathname).toEqual('/profile');
    });
    it('should provide an affordance to logout', () => {
      const found = rendered.find(MenuItem);
      expect(found.length).toEqual(2);
      expect(found.at(1).children().text()).toEqual('Log Out');
      found.at(1).simulate('click');
      expect(history.location.pathname).toEqual('/logout');
    });
  });
});
