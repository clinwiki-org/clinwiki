import React from 'react';
import { shallow, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import AuthButton from 'components/AuthButton';
import SearchInput from 'components/SearchInput';
import { createMemoryHistory } from 'history';
import { AuthHeader } from '../index';

describe('<AuthHeader />', () => {
  const searchChanged = jest.fn();
  const authheader = { user: { email: 'foo@bar.com' } };
  const history = createMemoryHistory();
  const component = (
    <AuthHeader
      authheader={authheader}
      searchActions={{ searchChanged }}
      history={history}
    />
  );

  const rendered = shallow(component);
  it('should render the auth button', () => {
    expect(rendered.contains(
      <AuthButton
        user={authheader.user}
        history={history}
      />
    )).toBe(true);
  });
  it('should render the search input', () => {
    expect(rendered.contains(
      <SearchInput
        history={history}
        searchChanged={searchChanged}
      />
    )).toBe(true);
  });
  it('should correctly delegate search changes to search input', () => {
    const mounted = mount(
      <IntlProvider locale="en">
        {component}
      </IntlProvider>
    );
    mounted.find('input[type="text"]').simulate('change', { target: { value: 'search' } });
    mounted.find('form.searchInput').simulate('submit');
    expect(searchChanged).toHaveBeenCalled();
  });
});
