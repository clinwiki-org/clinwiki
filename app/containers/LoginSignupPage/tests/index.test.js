import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router';
import { createMemoryHistory } from 'history';
import { mount } from 'enzyme';
import ReactSignupLoginComponent from 'components/ReactSignupLoginComponent/ReactSignupLoginComponent';
import { LoginSignupPage } from '../index';

describe('<LoginSignupPage />', () => {
  it('should show the loginsignup component by default', () => {
    const actions = {};
    const match = { params: {}, path: '', url: '' };
    const LoginSignupPageSelector = {};
    const history = createMemoryHistory('/login-signup');
    const mounted = mount(
      <IntlProvider locale="en">
        <MemoryRouter individualEntries={['/login-signup']}>
          <LoginSignupPage
            actions={actions}
            match={match}
            LoginSignupPage={LoginSignupPageSelector}
            location={history.location}
          />
        </MemoryRouter>
      </IntlProvider>
    );
    expect(mounted.contains(ReactSignupLoginComponent)).toBe(true);
  });
});
