import React from 'react';
import { mount } from 'enzyme';
import LoadingPane from 'components/LoadingPane';
import TagsSection from '../index';

describe('<TagsSection />', () => {
  describe('without a studypage', () => {
    const rendered = mount(<TagsSection />);
    it('shows a loading pane', () => {
      expect(rendered.html()).toEqual(mount(<LoadingPane />).html());
    });
  });
  describe('with a studypage', () => {
    const getRendered = (props) => mount(
      <TagsSection {...props} />
    );
    describe('when logged in', () => {
      describe('without tags', () => {
        const onAnonymousClick = jest.fn();
        const submitTag = jest.fn();
        const props = {
          StudyPage: { study: { nct_id: 'nct12345' } },
          loggedIn: true,
          onAnonymousClick,
          submitTag,
        };
        const rendered = getRendered(props);
        it('does not show any tags', () => {
          expect(rendered.find('tr.tag-row').length).toEqual(0);
          expect(rendered.find('tr#no-tags-found').length).toEqual(1);
        });
        it('provides an interface for adding tags', () => {
          expect(rendered.find('form#add-tag-form').length).toEqual(1);
        });
        it('does not lets logged in users submit tags', () => {
          rendered.find('#submit-tag').first().simulate('click');
          expect(onAnonymousClick).not.toBeCalled();
          expect(submitTag).toBeCalled();
        });
      });
      describe('with tags', () => {
        const onAnonymousClick = jest.fn();
        const removeTag = jest.fn();
        const submitTag = jest.fn();
        const props = {
          StudyPage: {
            study: {
              nct_id: 'nct12345',
              tags: ['foo', 'bar', 'baz'],
            },
          },
          loggedIn: true,
          onAnonymousClick,
          removeTag,
          submitTag,
        };
        const rendered = getRendered(props);
        it('shows a row for each tag, with the ability to delete', () => {
          const tagRows = rendered.find('tr.tag-row');
          expect(tagRows.length).toEqual(3);
          expect(tagRows.at(0).find('.tag-value').text()).toEqual('foo');
          expect(tagRows.at(0).find('.remove-col').length).toEqual(1);
          expect(tagRows.at(1).find('.tag-value').text()).toEqual('bar');
          expect(tagRows.at(1).find('.remove-col').length).toEqual(1);
          expect(tagRows.at(2).find('.tag-value').text()).toEqual('baz');
          expect(tagRows.at(2).find('.remove-col').length).toEqual(1);
        });
        it('lets logged-in users delete', () => {
          rendered.find('#remove-tag-foo').first().simulate('click');
          expect(onAnonymousClick).not.toBeCalled();
          expect(removeTag).toBeCalled();
        });
      });
    });
    describe('when anonymous', () => {
      describe('without tags', () => {
        const onAnonymousClick = jest.fn();
        const submitTag = jest.fn();
        const props = {
          StudyPage: { study: { nct_id: 'nct12345' } },
          onAnonymousClick,
          submitTag,
        };
        const rendered = getRendered(props);
        it('does not show any tags', () => {
          expect(rendered.find('tr.tag-row').length).toEqual(0);
          expect(rendered.find('tr#no-tags-found').length).toEqual(1);
        });
        it('provides an interface for adding tags', () => {
          expect(rendered.find('form#add-tag-form').length).toEqual(1);
        });
        it('does not let anonyous users submit tags', () => {
          rendered.find('#submit-tag').first().simulate('click');
          expect(onAnonymousClick).toBeCalled();
          expect(submitTag).not.toBeCalled();
        });
      });
      describe('with tags', () => {
        const onAnonymousClick = jest.fn();
        const removeTag = jest.fn();
        const submitTag = jest.fn();
        const props = {
          StudyPage: {
            study: {
              nct_id: 'nct12345',
              tags: ['foo', 'bar', 'baz'],
            },
          },
          onAnonymousClick,
          removeTag,
          submitTag,
        };
        const rendered = getRendered(props);
        it('shows a row for each tag, with the ability to delete', () => {
          const tagRows = rendered.find('tr.tag-row');
          expect(tagRows.length).toEqual(3);
          expect(tagRows.at(0).find('.tag-value').text()).toEqual('foo');
          expect(tagRows.at(0).find('.remove-col').length).toEqual(1);
          expect(tagRows.at(1).find('.tag-value').text()).toEqual('bar');
          expect(tagRows.at(1).find('.remove-col').length).toEqual(1);
          expect(tagRows.at(2).find('.tag-value').text()).toEqual('baz');
          expect(tagRows.at(2).find('.remove-col').length).toEqual(1);
        });
        it('does not let anonymous users delete', () => {
          rendered.find('#remove-tag-foo').first().simulate('click');
          expect(onAnonymousClick).toBeCalled();
          expect(submitTag).not.toBeCalled();
        });
      });
    });
  });
});
