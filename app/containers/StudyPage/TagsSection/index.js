/**
*
* TagsSection
*
*/
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Grid, Row, Col, Table, FormGroup, FormControl, Form, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import LoadingPane from 'components/LoadingPane';

const TagsWrapper = styled.div`
  .remove-col {
    text-align: right;
  }
`;

class TagsSection extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onTagRemove = this.onTagRemove.bind(this);
    this.onTagSubmit = this.onTagSubmit.bind(this);
    this.changeNewTag = this.changeNewTag.bind(this);
    this.newTag = '';
  }

  onTagRemove(e, tag) {
    e.persist();
    e.preventDefault();
    if (this.props.loggedIn) {
      this.props.removeTag(this.props.StudyPage.study.nct_id, tag);
    } else {
      this.props.onAnonymousClick();
    }
  }

  onTagSubmit(e) {
    e.persist();
    e.preventDefault();
    if (this.props.loggedIn) {
      this.props.submitTag(this.props.StudyPage.study.nct_id, this.newTag);
      this.textInput.value = '';
    } else {
      this.props.onAnonymousClick();
    }
  }

  changeNewTag(e) {
    this.newTag = e.target.value;
  }


  render() {
    if (!_.get(this.props, 'StudyPage.study')) {
      return <LoadingPane />;
    }
    const tags = _.get(this.props, 'StudyPage.study.tags');

    let tagList;
    if (!tags) {
      tagList = <tr id="no-tags-found"><td colSpan={2}><b>No tags for this study.</b></td></tr>;
    } else {
      tagList = tags.map((tag) => (
        <tr key={tag} className={`tag-row tag-row-${tag.replace(' ', '-')}`}>
          <th className="tag-value">
            {tag}
          </th>
          <td className="remove-col">
            <FontAwesome
              id={`remove-tag-${tag.replace(' ', '-')}`}
              className="remove"
              name="remove"
              style={{ cursor: 'pointer', color: '#cc1111' }}
              onClick={(e) => this.onTagRemove(e, tag)}
            />
          </td>
        </tr>
      ));
    }

    return (
      <Grid>
        <TagsWrapper>
          <Row>
            <Col md={6}>
              <Table condensed striped>
                <thead>
                  <tr>
                    <th>Tags</th>
                    <td />
                  </tr>
                </thead>
                <tbody>
                  {tagList}
                </tbody>
              </Table>
            </Col>
            <Col md={3} mdOffset={3}>
              <Form id="add-tag-form" inline onSubmit={this.onSubmit} className="tagInput pull-right">
                <FormGroup controlId="formInlineTag">
                  <FormControl
                    type="text"
                    inputRef={(ref) => { this.textInput = ref; }}
                    onFocus={this.onFocus}
                    onChange={this.changeNewTag}
                    onKeyPress={(e) => {
                      if (e.charCode === 13) {
                        this.onTagSubmit(e);
                      }
                    }}
                    placeholder={'add a tag'}
                  />
                  <Button id="submit-tag" type="submit" onClick={(e) => this.onTagSubmit(e)}>
                    Add Tag
                  </Button>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </TagsWrapper>
      </Grid>
    );
  }
}

TagsSection.propTypes = {
  StudyPage: PropTypes.object,
  submitTag: PropTypes.func,
  removeTag: PropTypes.func,
  loggedIn: PropTypes.bool,
  onAnonymousClick: PropTypes.func,
};

export default TagsSection;
