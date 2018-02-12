import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount } from 'enzyme';
import { ProfilePage } from '../index';

describe('<ProfilePage />', () => {
  const actions = {
    submitProfile: jest.fn(),
  };
  const profilepage = {
    fields: ['nct_id', 'title', 'overall_status'],
  };
  let authheader;
  const subject = () => mount(
    <IntlProvider locale="en">
      <ProfilePage
        profilepage={profilepage}
        authheader={authheader}
        actions={actions}
      />
    </IntlProvider>
  );
  describe('when not logged in', () => {
    beforeEach(() => {
      authheader = { user: { loggedIn: false } };
    });
    it('shows an error message', () => {
      expect(subject().contains(<h1>Not logged in!</h1>)).toEqual(true);
    });
  });
  describe('when logged in', () => {
    let rendered;
    beforeAll(() => {
      authheader = {
        user: {
          first_name: 'foo',
          last_name: 'barson',
          default_query_string: 'hela',
          search_result_columns: ['nct_id'],
          loggedIn: true,
        },
      };
      rendered = subject();
    });
    it('contains a field group for first name', () => {
      const selector = rendered.find({ controlId: 'first_name' });
      expect(selector.length).toEqual(1);
      expect(rendered.render().find('input#first_name')[0].attribs.value).toEqual(authheader.user.first_name);
    });
    it('contains a field group for last name', () => {
      const selector = rendered.find({ controlId: 'last_name' });
      expect(selector.length).toEqual(1);
      expect(rendered.render().find('input#last_name')[0].attribs.value).toEqual(authheader.user.last_name);
    });
    it('contains a field group for default query string', () => {
      const selector = rendered.find({ controlId: 'default_query_string' });
      expect(selector.length).toEqual(1);
      expect(rendered.render().find('input#default_query_string')[0].attribs.value).toEqual(authheader.user.default_query_string);
    });
    it('does not show the column picker by default', () => {
      expect(rendered.find('#column-picker').length).toEqual(0);
    });
    describe('when clicking the column picker', () => {
      beforeAll(() => rendered.find('button#toggle-column-picker').simulate('click'));
      it('shows the column picker on click', () => {
        expect(rendered.find('div#column-picker').length).toEqual(1);
        expect(rendered.find({ type: 'checkbox', id: 'checkbox-nct_id' }).props().checked).toBeTruthy();
        expect(rendered.find({ type: 'checkbox', id: 'checkbox-title' }).props().checked).toBeFalsy();
      });
    });
    describe('when submitting the form', () => {
      it('triggers the submitProfile action', () => {
        rendered.find('button#submit-profile-form').simulate('click');
        expect(actions.submitProfile).not.toBeCalled();
      });
    });
  });
});
