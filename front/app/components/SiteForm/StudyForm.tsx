import * as React from 'react';
import styled from 'styled-components';
import {
  Nav,
  NavItem,
  Row,
  Col,
  Checkbox,
  Panel,
  FormControl,
  Button,
} from 'react-bootstrap';
import { SiteViewFragment } from 'types/SiteViewFragment';
import { History, Location } from 'history';
import { match, Switch, Route, Redirect } from 'react-router';
import { trimPath } from 'utils/helpers';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import {
  pipe,
  split,
  reject,
  isEmpty,
  map,
  findIndex,
  propEq,
  reverse,
  sortBy,
  prop,
  isNil,
  find,
} from 'ramda';
import MultiInput from 'components/MultiInput';
import { parse } from 'graphql';

interface StudyFormProps {
  view: SiteViewFragment;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
  history: History;
  match: match<{}>;
  location: Location;
  handleForm: any;
}

interface StudyFormState {
  newSectionName: string;
}

const StyledCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
`;

const StyledFormControl = styled(FormControl)`
  margin-bottom: 15px;
`;

const FormContainer = styled(Panel)`
  padding: 15px;
  min-height: 420px;
`;

const SectionForm = styled.div`
  padding: 15px 0 15px 15px;
`;

type Section = {
  name: string;
  displayName: string;
  path: string;
  order?: number | null;
  kind: 'basic' | 'extended';
};

class StudyForm extends React.Component<StudyFormProps, StudyFormState> {
  state: StudyFormState = {
    newSectionName: '',
  };

  handleCheckboxToggle = value => (e: {
    currentTarget: { name: string; value: any };
  }) => {
    this.props.onAddMutation({
      currentTarget: { name: e.currentTarget.name, value: !value },
    });
  };

  renderBasicSection = (
    section: Section,
    data: SiteStudyBasicGenericSectionFragment
  ) => {
    return (
      <div>
        <StyledCheckbox
          name={`set:study.basicSections.${section.name}.hide`}
          checked={data.hide}
          onChange={this.handleCheckboxToggle(data.hide)}>
          Hide Section
        </StyledCheckbox>
      </div>
    );
  };

  renderExtendedSection = (
    section: Section,
    data: SiteStudyExtendedGenericSectionFragment
  ) => {
    const fields = data.fields || this.props.view.study.allFields;
    return (
      <div>
        <StyledCheckbox
          name={`set:study.extendedSections.${section.name}.hide`}
          checked={data.hide}
          onChange={this.handleCheckboxToggle(data.hide)}>
          Hide Section
        </StyledCheckbox>
        <label>Section name</label>
        <StyledFormControl
          name={`set:study.${section.name}.title`}
          placeholder="Add facet"
          value={data.title}
          onChange={this.props.onAddMutation}
        />
        <label>Order</label>
        <StyledFormControl
          name={`set:study.${section.name}.order`}
          placeholder="Order"
          value={data.order || ''}
          onChange={this.props.onAddMutation}
        />
        <label>Fields filter</label>
        <StyledFormControl
          name={`set:study.${section.name}.selected.kind`}
          componentClass="select"
          onChange={this.props.onAddMutation}
          value={data.selected.kind}>
          <option value="BLACKLIST">All except</option>
          <option value="WHITELIST">Only</option>
        </StyledFormControl>
        <MultiInput
          name={`set:study.extendedSections.${section.name}.selected.values`}
          options={fields.map(field => ({ id: field, label: field }))}
          placeholder="Add field"
          draggable
          value={data.selected.values}
          onChange={this.props.onAddMutation}
        />
      </div>
    );
  };

  handleSelect = (key: string) => {
    this.props.history.push(`${trimPath(this.props.match.url)}${key}`);
  };

  handleNewSectionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newSectionName: e.currentTarget.value });
  };

  handleAddSection = () => {
    const section = {
      hide: false,
      title: this.state.newSectionName,
      name: this.state.newSectionName.toLowerCase(),
      order: null,
      selected: {
        kind: 'WHITELIST',
        values: [],
      },
    };
    this.props.onAddMutation({
      currentTarget: {
        name: `push:study.extendedSections`,
        value: JSON.stringify(section),
      },
    });
    this.setState({ newSectionName: '' });
  };

  getSections = (): Section[] => {
    const {
      basicSections: basicSectionsRaw,
      extendedSections: extendedSectionsRaw,
    } = this.props.view.study;
    const basicSections = basicSectionsRaw.map(section => ({
      name: section.title.toLowerCase(),
      path: `/${section.title.toLowerCase()}`,
      displayName: section.title,
      kind: 'basic',
    }));
    const extendedSections = extendedSectionsRaw.map(section => ({
      name: section.title.toLowerCase(),
      path: `/${section.title.toLowerCase()}`,
      displayName: section.title,
      kind: 'extended',
      order: section.order,
    }));
    // @ts-ignore
    const sortedExtendedSections = sortBy(
      pipe(prop('order'), parseInt),
      extendedSections
    );
    return [...basicSections, ...sortedExtendedSections] as Section[];
  };

  getCurrentSectionPath = (): string => {
    const pathComponents = pipe(
      split('/'),
      reject(isEmpty),
      map(x => `/${x}`),
      // @ts-ignore
      reverse
    )(trimPath(this.props.location.pathname)) as string[];

    for (const component of pathComponents) {
      if (findIndex(propEq('path', component), this.getSections()) >= 0) {
        return component;
      }
    }

    return '/';
  };
  componentDidMount() {
    this.props.handleForm();
  }
  render() {
    return (
      <div>
        <Row>
          <Col md={2}>
            <Nav
              bsStyle="pills"
              stacked
              activeKey={this.getCurrentSectionPath()}
              onSelect={this.handleSelect}>
              {this.getSections().map((section: Section) => (
                <NavItem key={section.path} eventKey={section.path}>
                  {section.displayName}
                </NavItem>
              ))}
            </Nav>
            <SectionForm>
              <StyledFormControl
                placeholder="Add a section"
                value={this.state.newSectionName}
                onChange={this.handleNewSectionNameChange}
              />
              <Button onClick={this.handleAddSection}>Add</Button>
            </SectionForm>
          </Col>
          <Col md={10}>
            <FormContainer>
              <Switch>
                {this.getSections().map(section => (
                  <Route
                    key={`${trimPath(this.props.match.url)}${section.path}`}
                    path={`${trimPath(this.props.match.url)}${section.path}`}
                    render={() =>
                      section.kind === 'basic'
                        ? this.renderBasicSection(
                            section,
                            // @ts-ignore
                            find(
                              propEq('title', section.displayName),
                              this.props.view.study.basicSections
                            )
                          )
                        : this.renderExtendedSection(
                            section,
                            // @ts-ignore
                            find(
                              propEq('title', section.displayName),
                              this.props.view.study.extendedSections
                            )
                          )
                    }
                  />
                ))}
                <Redirect to={`${trimPath(this.props.match.url)}/wiki`} />
              </Switch>
            </FormContainer>
          </Col>
        </Row>
      </div>
    );
  }
}

export default StudyForm;
