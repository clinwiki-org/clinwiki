import * as React from 'react';
import {
  Row,
  Col,
  Panel,
  PanelGroup,
  DropdownButton,
  MenuItem,
  FormControl,
} from 'react-bootstrap';
import { SiteViewFragment } from 'services/site/model/SiteViewFragment';
import { displayFields } from 'utils/siteViewHelpers';
import { StyledContainer, StyledFormControl, StyledLabel } from './Styled';
import MultiInput from 'components/MultiInput';
import AggField from './AggField';
import { sentanceCase } from 'utils/helpers';
import { aggsOrdered, studyFields } from 'utils/constants';
import aggToField from 'utils/aggs/aggToField';
import { FilterKind } from 'types/globalTypes';
import { Checkbox } from 'react-bootstrap';
import styled from 'styled-components';
import { match } from 'react-router';
import { SiteViewMutationInput } from 'types/globalTypes';
import {
  updateView,
  createMutation,
  getViewValueByPath,
  serializeMutation,
} from 'utils/siteViewUpdater';
import { equals } from 'ramda';
import { History, Location } from 'history';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';
import ThemedButton from 'components/StyledComponents/index';
import RichTextEditor, { EditorValue, getTextAlignClassName, getTextAlignStyles } from 'react-rte';
import {
  SiteFragment,
  SiteFragment_siteViews,
  SiteFragment_siteView,
} from 'services/site/model/SiteFragment';
import SearchTemplate from './SearchTemplate';
import { connect } from 'react-redux';
import { updateSiteView } from 'services/site/actions';

interface SearchFormProps {
  match: match<{ id: string }>;
  view: SiteViewFragment;
  siteViews: SiteFragment_siteViews[];
  siteViewId: any;
  history: History;
  location: Location;
  site: SiteFragment;
  theme: Theme;
  updateSiteView: any;
  isUpdating: any;
  isLoading: any;
}

interface SearchFormState {
  showAllAggs: boolean;
  showAllCrowdAggs: boolean;
  showAllAggsPresearch: boolean;
  showAllCrowdAggsPresearch: boolean;
  showAllAggsAutoSuggest: boolean;
  showAllCrowdAggsAutoSuggest: boolean;
  mutations: SiteViewMutationInput[];
  showFacetBar: boolean;
  showFacetBarConfig: boolean;
  resultsButtonsArray: any[];
  siteUrl: string;
  siteViewName: string;
  presearchIntructions: EditorValue | null;
}

const SEARCH_FIELDS = studyFields.map(option => ({
  id: option,
  label: sentanceCase(option),
}));
const AGGS_OPTIONS = aggsOrdered.map(option => ({
  id: option,
  label: sentanceCase(aggToField(option, option)),
}));

const AggsHeaderContainer = styled.div`
  display: flex;
  color: white;
  align-items: center;
  justify-content: space-between;
  margin: 25px 0 10px 0;

  h3 {
    margin: 0;
  }
`;

const StyledButton = styled(ThemedButton)`
  margin-right: 15px;
`;

const StyledCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
`;

const StyledPanelHeading = styled.div`
  display: flex;
`;
const StyledShowContainer = styled.div`
  display: flex;
  font-size: 16px;
  margin-left: auto;
  .checkbox {
    margin: 0;
    padding-left: 1em;
  }
`;

const StyledButtonGroup = styled.div`
  margin: 1em 1em 1em 0;
  .button-label {
    color: white;
    font-size: 1.25em;
    margin-right: 1em;
  }
  ul li a {
    color: black !important;
  }
`;
const StyledFormInput = styled(FormControl)`
  margin-bottom: 20px;
  background: white;
  border: none;
  box-shadow: none;
  color: #333;
  font-size: 2em;
  padding-left: 5px;
`;

class SearchForm extends React.Component<SearchFormProps, SearchFormState> {
  state: SearchFormState = {
    showAllAggs: false,
    showAllCrowdAggs: false,
    mutations: [],
    showFacetBar: false,
    showFacetBarConfig: false,
    showAllAggsPresearch: false,
    showAllCrowdAggsPresearch: false,
    showAllAggsAutoSuggest: false,
    showAllCrowdAggsAutoSuggest: false,
    resultsButtonsArray: [],
    siteUrl: '',
    siteViewName: '',
    presearchIntructions: null,
  };

  componentDidMount() {
    const siteviewId = +this.props.match.params.id;
    let view = this.props.siteViews.find(view => siteviewId == view.id);
    if (view?.search.presearch.instructions) {
      this.setState({
        resultsButtonsArray: view.search.results.buttons.items,
        siteUrl: view.url || '',
        siteViewName: view.name || '',
        presearchIntructions: RichTextEditor.createValueFromString(
          view.search.presearch.instructions,
          'html'
        ),
      });
    } else {
      this.setState({
        resultsButtonsArray: view?.search?.results?.buttons?.items || [],
        siteUrl: view?.url || '',
        siteViewName: view?.name || '',
        presearchIntructions: '',
      });
    }
  }
  
  handleContentChange = (value: EditorValue) => {
    //console.log("RTE VALUE ",value )
    this.setState({ presearchIntructions: value });
  };

  handleSubmitInstructions = siteView => {
    //console.log("SUBMIT insturctions", this.state.presearchIntructions.toString("html",  {blockStyleFn: getTextAlignStyles} ))
    this.handleAddMutation(
      {
        currentTarget: {
          name: 'set:search.presearch.instructions',
          value: this.state.presearchIntructions.toString("html",  {blockStyleFn: getTextAlignStyles} ),
        },
      },
      siteView
    );
  };

  handleSave = (view: any) => () => {
    const { site, isUpdating, isLoading } = this.props;
    //console.log('save view', view);
    let input = {
      mutations: this.state.mutations.map(serializeMutation),
      id: view.id,
      name: view.name,
      url: view.url,
      default: view.default,
    }
    this.props.updateSiteView(site.id, input);
    if (!isUpdating && !isLoading) {
      this.props.history.push(`/sites/${site.id}/edit/siteviews`)
    
    }
};



  handleInput = (e, inputType) => {
    switch (inputType) {
      case 'url':
        this.setState({ siteUrl: e.value });
        return;
      case 'name':
        this.setState({ siteViewName: e.value });
        return;
      // case 'instruction':
      //   this.setState({ presearchIntructions: e.value });
      //   return;
    }
  };

  handleAddMutation = (
    e: { currentTarget: { name: string; value: any } },
    siteView
  ) => {
    const { name, value } = e.currentTarget;
    const mutation = createMutation(name, value);
    const view = updateView(siteView, this.state.mutations);
    const currentValue = getViewValueByPath(mutation.path, view);
    if (equals(value, currentValue)) return;
    this.setState({ mutations: [...this.state.mutations, mutation] }, () => {
      //console.log('MUTATIONS', this.state.mutations);
    });
  };

  handleAddMutationForDeleteButton = (e: {
    currentTarget: { name: string; value: any };
  }) => {
    const { name, value } = e.currentTarget;
    const mutation = createMutation(name, value);
    this.setState({ mutations: [...this.state.mutations, mutation] }, () => {
      console.log('MUTATIONS', this.state.mutations);
    });
  };
  handleDeleteButton = (view, index) => {
    let name = `set:search.results.buttons.items`;

    let items = view.search.results.buttons.items;
    items.splice(index, 1);
    this.handleAddMutationForDeleteButton({
      currentTarget: { name: name, value: items },
    });
  };
  getCrowdFields = view => {
    return view.search.crowdAggs.fields.map(field => ({
      id: field.name,
      label: sentanceCase(field.name),
    }));
  };

  handleShowAllToggle = (
    kind: 'aggs' | 'crowdAggs' | 'aggsPresearch' | 'crowdAggsPresearch'
  ) => () => {
    if (kind === 'aggs') {
      this.setState({ showAllAggs: !this.state.showAllAggs });
    } else if (kind === 'crowdAggs') {
      this.setState({ showAllCrowdAggs: !this.state.showAllCrowdAggs });
    } else if (kind === 'aggsPresearch') {
      this.setState({ showAllAggsPresearch: !this.state.showAllAggsPresearch });
    } else {
      this.setState({
        showAllCrowdAggsPresearch: !this.state.showAllCrowdAggsPresearch,
      });
    }
  };
  handleCheckboxToggle = value => (e: {
    currentTarget: { name: string; value: any };
  }) => {
    let siteViewId = +this.props.match.params.id;
    let thisSiteView = this.props.siteViews.find(
      siteview => siteview.id === siteViewId
    );
    this.handleAddMutation(
      {
        currentTarget: { name: e.currentTarget.name, value: !value },
      },
      thisSiteView
    );
  };

  handleAddMutationWithName = (value, view, name) => {
    // this.setState({showFacetBar: x})
    const e = { currentTarget: { name: name, value: value } };
    this.handleAddMutation(e, view);
  };
  handleAddButton = view => {
    let name = `set:search.results.buttons.items`;

    let items = view.search.results.buttons.items;
    let newItem = { icon: '', target: '', __typename: 'ResultButtonItems' };
    let newItems = [...items, newItem];

    this.setState({ resultsButtonsArray: newItems });
    this.handleAddMutation(
      { currentTarget: { name: name, value: newItems } },
      view
    );
  };
  handlePresearchButtonTarget = (
    e: { currentTarget: { name: string; value: any } },
    siteView,
    value
  ) => {
    // let items = this.state.resultsButtonsArray
    // let newItem = {... items[position],
    //     target: value
    // }
    // let newArray : any[]=[]
    // items.map((val, index)=>{
    //   if(index==position){
    //     newArray.push(newItem)
    //   }else{
    //     newArray.push(val)
    //   }

    // })

    this.handleAddMutation(
      { currentTarget: { name: e.currentTarget.name, value: value } },
      siteView
    );
    // this.setState({resultsButtonsArray: newArray })
  };
  handleButtonTarget = (
    e: { currentTarget: { name: string; value: any } },
    siteView,
    position,
    value
  ) => {
    let items = this.state.resultsButtonsArray;
    let newItem = { ...items[position], target: value };
    let newArray: any[] = [];
    items.map((val, index) => {
      if (index === position) {
        newArray.push(newItem);
      } else {
        newArray.push(val);
      }
    });
    if (newArray.length === position) {
      newArray.push(newItem);
    }
    this.handleAddMutation(
      { currentTarget: { name: e.currentTarget.name, value: newArray } },
      siteView
    );
    this.setState({ resultsButtonsArray: newArray });
  };

  handleButtonIcon = (
    e: { currentTarget: { name: string; value: any } },
    siteView,
    position,
    value
  ) => {
    let items = this.state.resultsButtonsArray;
    let newItem = { ...items[position], icon: value };
    let newArray: any[] = [];
    items.map((val, index) => {
      if (index === position) {
        newArray.push(newItem);
      } else {
        newArray.push(val);
      }
    });

    this.handleAddMutation(
      { currentTarget: { name: e.currentTarget.name, value: newArray } },
      siteView
    );
    this.setState({ resultsButtonsArray: newArray });
  };

  renderResultsButtons = view => {
    let ICONS = ['table', 'card', 'search', 'list', 'small masonry', 'large masonry','object', 'newspaper'];
    let buttonsArray = view.search.results.buttons.items;
    let siteViews = this.props.siteViews;
    let thisSiteView =
      siteViews.find(siteview => siteview.url === view.url) || view.siteView;

    return buttonsArray.map((value, index) => (
      <Panel key={index + value}>
        <Panel.Heading>
          <StyledPanelHeading>
            <Panel.Title toggle>Button {index + 1} </Panel.Title>

            <StyledShowContainer>
              <span
                onClick={() => this.handleDeleteButton(thisSiteView, index)}>
                X
              </span>
            </StyledShowContainer>
          </StyledPanelHeading>
        </Panel.Heading>
        <Panel.Body collapsible>
          <StyledPanelHeading>
            <StyledButtonGroup>
              <span className="button-label">Target URL: </span>
              <DropdownButton
                bsStyle="default"
                title={buttonsArray[index].target}
                key="default"
                id="dropdown-basic-default"
                style={{
                  margin: '1em 1em 1em 0',
                  background: this.props.theme.button,
                }}>
                {siteViews.map(site => (
                  <MenuItem
                    key={site.name}
                    name={`set:search.results.buttons.items`}
                    onClick={e =>
                      this.handleButtonTarget(e, thisSiteView, index, site.url)
                    }>
                    {site.url}
                  </MenuItem>
                ))}
              </DropdownButton>
            </StyledButtonGroup>

            <StyledButtonGroup>
              <span className="button-label"> Button Icon: </span>
              <DropdownButton
                bsStyle="default"
                title={buttonsArray[index].icon}
                key="default"
                id="dropdown-basic-default"
                style={{
                  margin: '1em 1em 1em 0',
                  background: this.props.theme.button,
                }}>
                {ICONS.map(icon => (
                  <MenuItem
                    key={icon}
                    name={`set:search.results.buttons.items`}
                    onClick={e =>
                      this.handleButtonIcon(e, thisSiteView, index, icon)
                    }>
                    {icon}
                  </MenuItem>
                ))}
              </DropdownButton>
            </StyledButtonGroup>
          </StyledPanelHeading>
        </Panel.Body>
      </Panel>
    ));
  };
  renderFacetBarConfig = (showFacetBar, view, fields, crowdFields) => {
    return (
      <Panel>
        <Panel.Heading>
          <StyledPanelHeading>
            <Panel.Title toggle>Facet Bar</Panel.Title>
            <StyledShowContainer>
              <span>Show</span>
              <StyledCheckbox
                name="set:search.config.fields.showFacetBar"
                checked={showFacetBar}
                onChange={this.handleCheckboxToggle(showFacetBar)}
              />
            </StyledShowContainer>
          </StyledPanelHeading>
        </Panel.Heading>
        <Panel.Body collapsible>
          <Row>
            <Col md={6}>
              <AggsHeaderContainer>
                <h3>Aggs visibility</h3>
                <StyledCheckbox
                  checked={this.state.showAllAggs}
                  onChange={this.handleShowAllToggle('aggs')}>
                  Show all
                </StyledCheckbox>
              </AggsHeaderContainer>
              <StyledLabel>Filter</StyledLabel>
              <StyledFormControl
                name="set:search.aggs.selected.kind"
                componentClass="select"
                onChange={e => this.handleAddMutation(e, view)}
                value={view.search.aggs.selected.kind}>
                <option value="BLACKLIST">All except</option>
                <option value="WHITELIST">Only</option>
              </StyledFormControl>
              <MultiInput
                name="set:search.aggs.selected.values"
                options={AGGS_OPTIONS}
                placeholder="Add facet"
                value={view.search.aggs.selected.values}
                onChange={e => this.handleAddMutation(e, view)}
              />
              <h3>Aggs settings</h3>
              {fields.map(field => (
                <AggField
                  kind="aggs"
                  key={field.name}
                  field={field}
                  onAddMutation={mut => this.handleAddMutation(mut, view)}
                  view={view}
                  configType="facetbar"
                  returnAll={true}
                  sortables={view.search.sortables}
                />
              ))}
            </Col>
            <Col md={6}>
              <AggsHeaderContainer>
                <h3>Crowd aggs visibility</h3>
                <StyledCheckbox
                  checked={this.state.showAllCrowdAggs}
                  onChange={this.handleShowAllToggle('crowdAggs')}>
                  Show all
                </StyledCheckbox>
              </AggsHeaderContainer>
              <StyledLabel>Filter</StyledLabel>
              <StyledFormControl
                name="set:search.crowdAggs.selected.kind"
                componentClass="select"
                onChange={(e: {
                  currentTarget: { name: string; value: any };
                }) => this.handleAddMutation(e, view)}
                value={view.search.crowdAggs.selected.kind}>
                <option value="BLACKLIST">All except</option>
                <option value="WHITELIST">Only</option>
              </StyledFormControl>
              <MultiInput
                name="set:search.crowdAggs.selected.values"
                options={this.getCrowdFields(view)}
                placeholder="Add facet"
                value={view.search.crowdAggs.selected.values}
                onChange={e => this.handleAddMutation(e, view)}
              />
              <h3>Crowd aggs settings</h3>
              {crowdFields.map(field => (
                <AggField
                  kind="crowdAggs"
                  key={field.name}
                  field={field}
                  onAddMutation={mut => this.handleAddMutation(mut, view)}
                  view={view}
                  configType="facetbar"
                  returnAll={true}
                />
              ))}
            </Col>
          </Row>
        </Panel.Body>
      </Panel>
    );
  };
  renderAutoSuggestConfig = (showAutoSuggest, view, fields, crowdFields) => {
    return (
      <Panel>
        <Panel.Heading>
          <StyledPanelHeading>
            <Panel.Title toggle>Auto Suggest</Panel.Title>
            <StyledShowContainer>
              <span>Show</span>
              <StyledCheckbox
                name="set:search.config.fields.showAutoSuggest"
                checked={showAutoSuggest}
                onChange={this.handleCheckboxToggle(showAutoSuggest)}
              />
            </StyledShowContainer>
          </StyledPanelHeading>
        </Panel.Heading>
        <Panel.Body collapsible>
          <Row>
            <Col md={6}>
              <AggsHeaderContainer>
                <h3>Aggs visibility</h3>
              </AggsHeaderContainer>

              <StyledLabel>Add to Autosuggest</StyledLabel>
              <MultiInput
                name="set:search.autoSuggest.aggs.selected.values"
                options={AGGS_OPTIONS}
                placeholder="Add facet"
                value={view.search.autoSuggest.aggs.selected.values}
                onChange={e => this.handleAddMutation(e, view)}
              />
              <h3>Aggs settings</h3>
              {fields.map(field => (
                <AggField
                  kind="aggs"
                  key={field.name}
                  field={field}
                  onAddMutation={mut => this.handleAddMutation(mut, view)}
                  view={view}
                  configType="autosuggest"
                  returnAll={true}
                />
              ))}
            </Col>
            <Col md={6}>
              <AggsHeaderContainer>
                <h3>Crowd aggs visibility</h3>
              </AggsHeaderContainer>
              <StyledLabel>Add to Autosuggest</StyledLabel>
              <MultiInput
                name="set:search.autoSuggest.crowdAggs.selected.values"
                options={this.getCrowdFields(view)}
                placeholder="Add facet"
                value={view.search.autoSuggest.crowdAggs.selected.values}
                onChange={e => this.handleAddMutation(e, view)}
              />
              <h3>Crowd aggs settings</h3>
              {crowdFields.map(field => (
                <AggField
                  kind="crowdAggs"
                  key={field.name}
                  field={field}
                  onAddMutation={mut => this.handleAddMutation(mut, view)}
                  view={view}
                  configType="autosuggest"
                  returnAll={true}
                />
              ))}
            </Col>
          </Row>
        </Panel.Body>
      </Panel>
    );
  };
  renderPreSearchConfig = (showPresearch, view, fields, crowdFields) => {
    return (
      <Panel>
        <Panel.Heading>
          <StyledPanelHeading>
            <Panel.Title toggle>Pre-Search</Panel.Title>

            <StyledShowContainer>
              <span>Show</span>
              <StyledCheckbox
                name="set:search.config.fields.showPresearch"
                checked={showPresearch}
                onChange={this.handleCheckboxToggle(showPresearch)}
              />
            </StyledShowContainer>
          </StyledPanelHeading>
        </Panel.Heading>
        <Panel.Body collapsible>
        <StyledShowContainer>
              <span>Show Results</span>
              <StyledCheckbox
                name="set:search.presearch.showResults"
                checked={view.search.presearch.showResults}
                onChange={this.handleCheckboxToggle(view.search.presearch.showResults)}
              />
            </StyledShowContainer>
          <Row>
            <Col md={6}>
              <AggsHeaderContainer>
                <h3>Aggs visibility</h3>
              </AggsHeaderContainer>
              <MultiInput
                name="set:search.presearch.aggs.selected.values"
                options={AGGS_OPTIONS}
                placeholder="Add facet"
                value={view.search.presearch.aggs.selected.values}
                onChange={e => this.handleAddMutation(e, view)}
              />
              <h3>Aggs settings</h3>
              {fields.map(field => (
                <AggField
                  kind="aggs"
                  key={field.name}
                  field={field}
                  onAddMutation={mut => this.handleAddMutation(mut, view)}
                  view={view}
                  configType="presearch"
                  returnAll={true}
                />
              ))}
            </Col>
            <Col md={6}>
              <AggsHeaderContainer>
                <h3>Crowd aggs visibility</h3>
              </AggsHeaderContainer>

              <MultiInput
                name="set:search.presearch.crowdAggs.selected.values"
                options={this.getCrowdFields(view)}
                placeholder="Add facet"
                value={view.search.presearch.crowdAggs.selected.values}
                onChange={e => this.handleAddMutation(e, view)}
              />
              <h3>Crowd aggs settings</h3>
              {crowdFields.map(field => (
                <AggField
                  kind="crowdAggs"
                  key={field.name}
                  field={field}
                  onAddMutation={mut => this.handleAddMutation(mut, view)}
                  view={view}
                  configType="presearch"
                  returnAll={true}
                />
              ))}
            </Col>
          </Row>
          <Panel>
            <Panel.Heading>
              <Panel.Title toggle>Presearch Instructions</Panel.Title>
            </Panel.Heading>
            <Panel.Body collapsible>
              <h3>Instructions:</h3>
              <RichTextEditor
                blockStyleFn={getTextAlignClassName}
                onChange={this.handleContentChange}
                value={
                  this.state.presearchIntructions ||
                  RichTextEditor.createEmptyValue()
                }
              />
              <ThemedButton
                style={{ marginTop: 10 }}
                onClick={() => this.handleSubmitInstructions(view)}>
                Submit
              </ThemedButton>
            </Panel.Body>
          </Panel>
          <Panel>
            <Panel.Heading>
              <Panel.Title toggle>Presearch Button</Panel.Title>

              <StyledShowContainer />
            </Panel.Heading>
            <Panel.Body collapsible>
              <h3>Text:</h3>
              <StyledFormInput
                name={`set:search.presearch.button.name`}
                placeholder={view.search.presearch.button.name}
                value={view.search.presearch.button.name}
                onChange={e => this.handleAddMutation(e, view)}
              />
              <StyledPanelHeading>
                <StyledButtonGroup>
                  <span className="button-label">Target URL</span>
                  <DropdownButton
                    bsStyle="default"
                    title={view.search.presearch.button.target}
                    key="default"
                    id="dropdown-basic-default"
                    style={{
                      margin: '1em 1em 1em 0',
                      background: this.props.theme.button,
                    }}>
                    {this.props.siteViews.map((view, i) => (
                      <MenuItem
                        key={`${view}-${i}`}
                        name={`set:search.presearch.button.target`}
                        onClick={e =>
                          this.handlePresearchButtonTarget(e, view, view.url)
                        }>
                        {view.url}
                      </MenuItem>
                    ))}
                  </DropdownButton>
                </StyledButtonGroup>
              </StyledPanelHeading>
            </Panel.Body>
          </Panel>
        </Panel.Body>
      </Panel>
    );
  };
  renderResultsConfig = (showResults: boolean, view: SiteFragment_siteView) => {
    return (
      <Panel>
        <Panel.Heading>
          <StyledPanelHeading>
            <Panel.Title toggle>Results</Panel.Title>

            <StyledShowContainer>
              <span>Show</span>
              <StyledCheckbox
                name="set:search.config.fields.showResults"
                checked={showResults}
                onChange={this.handleCheckboxToggle(showResults)}
              />
            </StyledShowContainer>
          </StyledPanelHeading>
        </Panel.Heading>
        <Panel.Body collapsible>
          {view.search.results.type === 'table' || view.search.results.type === 'table2'  ? (
            <>
              <h3>Fields</h3>
              <MultiInput
                name="set:search.fields"
                options={SEARCH_FIELDS}
                placeholder="Add field"
                draggable
                value={view.search.fields}
                onChange={e => this.handleAddMutation(e, view)}
              />
            </>
          ) : null}
          {view.search.results.type === 'table' || view.search.results.type === 'table2'   ? (
            null
          ) : (<>
            <h3>Template</h3>
            <SearchTemplate
              fields={studyFields}
              onTemplateChanged={t =>
                this.handleAddMutation(
                  {
                    currentTarget: { name: 'set:search.template', value: t },
                  },
                  view
                )
              }
              template={view.search.template}
            />
          </>)}
          <StyledButtonGroup>
            <span className="button-label">Results View:</span>
            <DropdownButton
              bsStyle="default"
              title={view.search.results.type + " view"}
              key="default"
              id="dropdown-basic-default"
              style={{
                margin: '1em 1em 1em 0',
                background: this.props.theme.button,
              }}>

              <MenuItem
                onClick={() =>
                  this.handleAddMutationWithName(
                    'table',
                    view,
                    'set:search.results.type'
                  )
                }>
                Table View
              </MenuItem>
              <MenuItem
                onClick={() =>
                  this.handleAddMutationWithName(
                    'masonry',
                    view,
                    'set:search.results.type'
                  )
                }>
                Masonry View
              </MenuItem>
              <MenuItem
                onClick={() =>
                  this.handleAddMutationWithName(
                    'list',
                    view,
                    'set:search.results.type'
                  )
                }>
                List View
              </MenuItem>
              <MenuItem divider />
              <MenuItem
                onClick={() =>
                  this.handleAddMutationWithName(
                    'map',
                    view,
                    'set:search.results.type'
                  )
                }>
                Map View
              </MenuItem>
            </DropdownButton>
            <PanelGroup id="accordion-uncontrolled">
              {this.renderResultsButtons(view)}
              <StyledButton
                style={{ marginTop: '1em' }}
                onClick={() => this.handleAddButton(view)}>
                Add Button
              </StyledButton>
            </PanelGroup>
          </StyledButtonGroup>
        </Panel.Body>
      </Panel>
    );
  };
  renderBreadCrumbsConfig = (showBreadCrumbs:boolean, view: SiteFragment_siteView) => {
    return (
      <Panel>
        <Panel.Heading>
          <StyledPanelHeading>
            <Panel.Title toggle>Bread Crumbs Bar</Panel.Title>
            <StyledShowContainer>
              <span>Show</span>
              <StyledCheckbox
                name="set:search.config.fields.showBreadCrumbs"
                checked={showBreadCrumbs}
                onChange={this.handleCheckboxToggle(showBreadCrumbs)}
              />
            </StyledShowContainer>
          </StyledPanelHeading>
        </Panel.Heading>
        <Panel.Body collapsible>
          <StyledButtonGroup>
            <span className="button-label">Show 'Search Within':</span>
            <StyledCheckbox
              name="set:search.crumbs.search"
              checked={view.search.crumbs.search}
              onChange={this.handleCheckboxToggle(view.search.crumbs.search)}
            />
          </StyledButtonGroup>
        </Panel.Body>
      </Panel>
    );
  };
  render() {
    const siteviewId = +this.props.match.params.id;
    let view = this.props.siteViews.find(view => siteviewId == view.id) as SiteViewFragment;
    if (!view) return null;

    //console.log([this.props.siteViews, siteviewId, view]);
    view = updateView(view, this.state.mutations);
    const { site } = this.props;
    const fields = displayFields(
      this.state.showAllAggs
        ? FilterKind.BLACKLIST
        : view.search.aggs.selected.kind,
      this.state.showAllAggs ? [] : view.search.aggs.selected.values,
      view.search.aggs.fields
    );
    const crowdFields = displayFields(
      this.state.showAllCrowdAggs
        ? FilterKind.BLACKLIST
        : view.search.crowdAggs.selected.kind,
      this.state.showAllCrowdAggs ? [] : view.search.crowdAggs.selected.values,
      view.search.crowdAggs.fields
    );
    const fieldsPresearch = displayFields(
      this.state.showAllAggsPresearch
        ? FilterKind.BLACKLIST
        : FilterKind.WHITELIST,
      this.state.showAllAggsPresearch
        ? []
        : view.search.presearch.aggs.selected.values,
      view.search.presearch.aggs.fields
    );
    const crowdFieldsPresearch = displayFields(
      this.state.showAllCrowdAggsPresearch
        ? FilterKind.BLACKLIST
        : FilterKind.WHITELIST,
      this.state.showAllCrowdAggsPresearch
        ? []
        : view.search.presearch.crowdAggs.selected.values,
      view.search.presearch.crowdAggs.fields
    );
    const fieldsAutoSuggest = displayFields(
      this.state.showAllAggsAutoSuggest
        ? FilterKind.BLACKLIST
        : FilterKind.WHITELIST,
      this.state.showAllAggsAutoSuggest
        ? []
        : view.search.autoSuggest.aggs.selected.values,
      view.search.autoSuggest.aggs.fields
    );
    const crowdFieldsAutoSuggest = displayFields(
      this.state.showAllCrowdAggsAutoSuggest
        ? FilterKind.BLACKLIST
        : FilterKind.WHITELIST,
      this.state.showAllCrowdAggsAutoSuggest
        ? []
        : view.search.autoSuggest.crowdAggs.selected.values,
      view.search.autoSuggest.crowdAggs.fields
    );

    const showFacetBar = view.search.config.fields.showFacetBar;
    const showBreadCrumbs = view.search.config.fields.showBreadCrumbs;
    const showAutoSuggest = view.search.config.fields.showAutoSuggest;
    const showResults = view.search.config.fields.showResults;
    const showPresearch = view.search.config.fields.showPresearch;
    return (
          <StyledContainer>
            <span
              style={{
                display: 'inline',
                width: '8em',
                fontSize: '2em',
              }}>
              Site Name:{' '}
            </span>
            <StyledFormInput
              name={`set:name`}
              placeholder={view?.name}
              value={this.state.siteViewName}
              onChange={e => this.handleInput(e, 'name')}
              onBlur={e => this.handleAddMutation(e, view)}
            />

            <span
              style={{
                display: 'inline',
                width: '16em',
                fontSize: '2em',
              }}>
              URL: clinwiki.org/search/
            </span>
            <StyledFormInput
              name={`set:url`}
              placeholder={view?.url}
              value={this.state.siteUrl}
              onChange={e => this.handleInput(e, 'url')}
              onBlur={e => this.handleAddMutation(e, view)}
            />
            <h3>Search Sections</h3>
            <PanelGroup id="accordion-uncontrolled">
              {this.renderFacetBarConfig(
                showFacetBar,
                view,
                fields,
                crowdFields
              )}
              {this.renderAutoSuggestConfig(
                showAutoSuggest,
                view,
                fieldsAutoSuggest,
                crowdFieldsAutoSuggest
              )}
              {this.renderPreSearchConfig(
                showPresearch,
                view,
                fieldsPresearch,
                crowdFieldsPresearch
              )}
              {this.renderResultsConfig(showResults, view! as SiteFragment_siteView)}
              {this.renderBreadCrumbsConfig(showBreadCrumbs, view! as SiteFragment_siteView)}
            </PanelGroup>
            <StyledButton onClick={this.handleSave(view)}>
              Save Site View
            </StyledButton>
          </StyledContainer>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateSiteView: (id, input) => dispatch(updateSiteView(id, input))
})

const mapStateToProps = (state, ownProps) => ({
  isUpdating: state.site.isUpdatingSiteView,
  isLoading: state.site.isFetchingSiteProvider
})

export default connect(mapStateToProps, mapDispatchToProps) (withTheme(SearchForm));
