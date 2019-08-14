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
  Label,
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
} from 'ramda';
import MultiInput from 'components/MultiInput';
import { parse } from 'graphql';

interface StudyFormProps {
  view: SiteViewFragment;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
  history: History;
  match: match<{}>;
  location: Location;
}

interface StudyFormState {}

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

type Section = {
  name: string;
  displayName: string;
  path: string;
  order?: number | null;
  kind: 'basic' | 'extended';
};

class StudyForm extends React.Component<StudyFormProps, StudyFormState> {
  state: StudyFormState = {};

  handleCheckboxToggle = value => (e: {
    currentTarget: { name: string; value: any };
  }) => {
    this.props.onAddMutation({
      currentTarget: { name: e.currentTarget.name, value: !value },
    });
  };

  renderBasicSection = (
    section: Section,
    data: SiteStudyBasicGenericSectionFragment,
  ) => {
    return (
      <div>
        <StyledCheckbox
          name={`set:study.${section.name}.hide`}
          checked={data.hide}
          onChange={this.handleCheckboxToggle(data.hide)}
        >
          Hide Section
        </StyledCheckbox>
      </div>
    );
  };

  renderExtendedSection = (
    section: Section,
    data: SiteStudyExtendedGenericSectionFragment,
  ) => {
    return (
      <div>
        <StyledCheckbox
          name={`set:study.${section.name}.hide`}
          checked={data.hide}
          onChange={this.handleCheckboxToggle(data.hide)}
        >
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
          value={data.selected.kind}
        >
          <option value="BLACKLIST">All except</option>
          <option value="WHITELIST">Only</option>
        </StyledFormControl>
        <MultiInput
          name={`set:study.${section.name}.selected.values`}
          options={data.fields.map(field => ({ id: field, label: field }))}
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

  getSections = (): Section[] => {
    const {
      administrative,
      crowd,
      descriptive,
      facilities,
      interventions,
      recruitment,
      reviews,
      tags,
      tracking,
      wiki,
    } = this.props.view.study;
    const basicSections = [
      {
        name: 'wiki',
        path: '/wiki',
        displayName: 'Wiki',
        kind: 'basic',
      },
      {
        name: 'crowd',
        path: '/crowd',
        displayName: 'Crowd',
        kind: 'basic',
      },
      {
        name: 'reviews',
        path: '/reviews',
        displayName: 'Reviews',
        kind: 'basic',
      },
      {
        name: 'facilities',
        path: '/sites',
        displayName: 'Sites',
        kind: 'basic',
      },
      {
        name: 'tags',
        path: '/tags',
        displayName: 'Tags',
        kind: 'basic',
      },
    ];

    const extendedSections = [
      {
        name: 'interventions',
        path: '/interventions',
        displayName: interventions.title,
        kind: 'extended',
        order: interventions.order,
      },
      {
        name: 'descriptive',
        path: '/descriptive',
        displayName: descriptive.title,
        kind: 'extended',
        order: descriptive.order,
      },

      {
        name: 'administrative',
        path: '/administrative',
        displayName: administrative.title,
        kind: 'extended',
        order: administrative.order,
      },
      {
        name: 'recruitment',
        path: '/recruitment',
        displayName: recruitment.title,
        kind: 'extended',
        order: recruitment.order,
      },
      {
        name: 'tracking',
        path: '/tracking',
        displayName: tracking.title,
        kind: 'extended',
        order: tracking.order,
      },
    ];
    // @ts-ignore
    const sortedExtendedSections = sortBy(
      pipe(
        prop('order'),
        parseInt,
      ),
      extendedSections,
    );
    return [...basicSections, ...sortedExtendedSections] as Section[];
  };

  getCurrentSectionPath = (): string => {
    const pathComponents = pipe(
      split('/'),
      reject(isEmpty),
      map(x => `/${x}`),
      // @ts-ignore
      reverse,
    )(trimPath(this.props.location.pathname)) as string[];

    for (const component of pathComponents) {
      if (findIndex(propEq('path', component), this.getSections()) >= 0) {
        return component;
      }
    }

    return '/';
  };

  render() {
    return (
      <div>
        <Row>
          <Col md={2}>
            <Nav
              bsStyle="pills"
              stacked
              activeKey={this.getCurrentSectionPath()}
              onSelect={this.handleSelect}
            >
              {this.getSections().map((section: Section) => (
                <NavItem key={section.path} eventKey={section.path}>
                  {section.displayName}
                </NavItem>
              ))}
            </Nav>
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
                            this.props.view.study[section.name],
                          )
                        : this.renderExtendedSection(
                            section,
                            this.props.view.study[section.name],
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
