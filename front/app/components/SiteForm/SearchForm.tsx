import * as React from 'react';
import { Row, Col, Panel, PanelGroup, DropdownButton, Dropdown, MenuItem, FormControl } from 'react-bootstrap';
import { SiteViewFragment } from 'types/SiteViewFragment';
import { displayFields } from 'utils/siteViewHelpers';
import { StyledContainer, StyledFormControl, StyledLabel } from './Styled';
import MultiInput from 'components/MultiInput';
import AggField from './AggField';
import { sentanceCase } from 'utils/helpers';
import { aggsOrdered, studyFields } from 'utils/constants';
import aggToField from 'utils/aggs/aggToField';
import { FilterKind } from 'types/globalTypes';
import { Checkbox, ToggleButtonGroup, ToggleButton, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { match } from 'react-router';
// import { Button } from 'react-bootstrap';
import { CreateSiteInput, SiteViewMutationInput } from 'types/globalTypes';
import UpdateSiteViewMutation, {
  UpdateSiteViewMutationFn,
} from 'mutations/UpdateSiteViewMutation';
import {
  updateView,
  createMutation,
  getViewValueByPath,
  serializeMutation,
} from 'utils/siteViewUpdater';
import { equals, prop, last, view } from 'ramda';
import { History, Location } from 'history';

interface SearchFormProps {
  match: match<{ id: string }>;
  view: SiteViewFragment;
  siteViews: any;
  siteViewId: any;
  history: History;
  location: Location;
  site: any;
}

interface SearchFormState {
  showAllAggs: boolean;
  showAllCrowdAggs: boolean;
  showAllAggsPresearch: boolean;
  showAllCrowdAggsPresearch: boolean;
  mutations: SiteViewMutationInput[];
  showFacetBar: boolean;
  showFacetBarConfig: boolean;
}

const SEARCH_FIELDS = studyFields.map(option => ({
  id: option,
  label: sentanceCase(option),
}));

const AGGS_OPTIONS = aggsOrdered.map(option => ({
  id: option,
  label: sentanceCase(aggToField(option)),
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

const StyledButton = styled(Button)`
  margin-right: 15px;
`;

const StyledCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
`;

const StyledPanelHeading =styled.div`
  display:flex;
`
const StyledShowContainer =styled.div`
  display:flex;
  font-size:16px;
  margin-left:auto;
  .checkbox{
    margin:0;
    padding-left:1em;
  }
  `

const StyledButtonGroup = styled.div`
  margin: 1em 1em 1em 0;

  ul li a{
    color:black !important;
  }
`
const StyledFormInput = styled(FormControl)`
margin-bottom: 20px;
background: none;
border: none;
box-shadow: none;
color: lightgrey;
font-size: 2em;
padding-left: 0;
`;

// const styledToggleButton = styled(ToggleButtonGroup)`
//   diplay: flex;
//   flex-direction: row;
//   `

class SearchForm extends React.Component<SearchFormProps, SearchFormState> {
  state: SearchFormState = {
    showAllAggs: false,
    showAllCrowdAggs: false,
    mutations: [],
    showFacetBar: false,
    showFacetBarConfig:false,
    showAllAggsPresearch: false,
    showAllCrowdAggsPresearch:false,
  };

  componentDidMount() {}

  handleSave = (updateSiteView: UpdateSiteViewMutationFn, view: any) => (
    mutations: SiteViewMutationInput[]
  ) => {
    updateSiteView({
      variables: {
        input: {
          mutations: this.state.mutations.map(serializeMutation),
          id: view.id,
          name: view.name,
          url: view.url,
          default: view.default,
          //@ts-ignore
          // showFacetBar: view.search.config.fields.showFacetBar
        },
      },
    });
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
      console.log('MUTATIONS', this.state.mutations);
    });
  };

  getCrowdFields = view => {
    return view.search.crowdAggs.fields.map(field => ({
      id: field.name,
      label: sentanceCase(field.name),
    }));
  };

  handleShowAllToggle = (kind: 'aggs' | 'crowdAggs'|'aggsPresearch'|'crowdAggsPresearch') => () => {
    if (kind == 'aggs') {
      this.setState({ showAllAggs: !this.state.showAllAggs });
    } else if(kind == 'crowdAggs') {
      this.setState({ showAllCrowdAggs: !this.state.showAllCrowdAggs });
    } else if(kind == 'aggsPresearch'){
      this.setState({showAllAggsPresearch:!this.state.showAllAggsPresearch});
    }else{
      this.setState({showAllCrowdAggsPresearch:!this.state.showAllCrowdAggsPresearch});
      
    }
  };
  handleCheckboxToggle = value => (e: {
    currentTarget: { name: string; value: any };
  }) => {
    console.log("this.props view", this.props.view)
    this.handleAddMutation(
      {
        currentTarget: { name: e.currentTarget.name, value: !value }
      },
      this.props.view
    );
  };
  handleFieldsOrderChange = () => {};

  handleShowFacetBar = (x, view, name) => {
    // this.setState({showFacetBar: x})
    console.log("Views from the 6", view)
    const e = { currentTarget: { name: name, value: x } };
    this.handleAddMutation(e, view);
  };
  handleAddButton =(view)=>{
    let name = `set:search.results.buttons.items`

    let items= view.search.results.buttons.items
    let newItem= {icon:"", target:"", __typename: "ResultButtonItems"}
    let newItems = [...items,
      newItem]

    this.handleAddMutation({ currentTarget:{ name: name, value: newItems }}, view)
  }
  handleButtonTarget = (    e: { currentTarget: { name: string; value: any } },
    siteView, position, value)=>{

    let items = siteView.search.results.buttons.items
    let newItem = {... items[position],
        target: value
    }
    let newArray=[]  
    items.map((val, index)=>{
      if(index==position){
        //@ts-ignore
        newArray.push(newItem)
      }else{
        //@ts-ignore
        newArray.push(val)
      }

    })

    this.handleAddMutation({currentTarget:{ name:e.currentTarget.name, value:newArray}}, siteView)

  }

  handleButtonIcon = (    e: { currentTarget: { name: string; value: any } },
      siteView, position, value)=>{
  
      let items = siteView.search.results.buttons.items
      let newItem = {... items[position],
          icon: value
      }
      let newArray=[]  
      items.map((val, index)=>{
        if(index==position){
          //@ts-ignore
          newArray.push(newItem)
        }else{
          //@ts-ignore
          newArray.push(val)
        }
  
      })

      this.handleAddMutation({currentTarget:{ name:e.currentTarget.name, value:newArray}}, siteView)


  }


  renderResultsButtons =(view)=>{
    let ICONS=['table', 'card']
    let buttonsArray = view.search.results.buttons.items
    console.log("b-Arrey",buttonsArray)
    console.log("siteViews", this.props.siteViews)
    let siteViewNames=[]
    let siteViewUrls=[]
    let siteViews = this.props.siteViews
    let thisSiteView =
    siteViews.find(siteview => siteview.url == view.url) ||
    view.siteView;
    console.log("HERE M8",thisSiteView)

    console.log(siteViewNames)
    return(

      buttonsArray.map( (value, index) =>(
      <Panel key={index}>
                <Panel.Heading>
      <Panel.Title toggle>Button {index+1}</Panel.Title>

                  <StyledShowContainer>
        </StyledShowContainer>
                </Panel.Heading>
                <Panel.Body collapsible>
                  <h3>Target: {buttonsArray[index].target}</h3> 
                  <h3>Icon: {buttonsArray[index].icon}</h3> 
                  <StyledPanelHeading>
            <StyledButtonGroup>
    <DropdownButton
      bsStyle="default"
      title="Button Target"
      key="default"
      id="dropdown-basic-default"
      style={{margin: "1em 1em 1em 0"}} 
    >
{      siteViews.map(site=>(
      <MenuItem 
      name={`set:search.results.buttons.items`}
      onClick={e => this.handleButtonTarget(
        e,
        thisSiteView,
       index, 
       site.url
      )}> 
         {site.name}</MenuItem>

      ))}

</DropdownButton>
</StyledButtonGroup>

                  <StyledButtonGroup>
    <DropdownButton
      bsStyle="default"
      title="Button Icon"
      key="default"
      id="dropdown-basic-default"
      style={{margin: "1em 1em 1em 0"}} 
    >
{      ICONS.map((icon)=>(
      <MenuItem 
      key={icon}
      name={`set:search.results.buttons.items`}
      onClick={e => this.handleButtonIcon(
        e,
        thisSiteView,
       index, 
       icon
      )}> 
         {icon}</MenuItem>

      ))}

</DropdownButton>
</StyledButtonGroup>
</StyledPanelHeading>
                </Panel.Body>
      </Panel> ))

    )

  }
  renderFacetBarConfig=(showFacetBar,view,fields, crowdFields,updateSiteView )=>{
      return(
        <Panel >
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
                  //@ts-ignore
                  field={field}
                  onAddMutation={this.handleAddMutation}
                  view={view}
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
                onChange={(e: { currentTarget: { name: string; value: any; }; }) => this.handleAddMutation(e, view)}
                v={view.search.crowdAggs.selected.kind}>
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
                  //@ts-ignore
                  field={field}
                  onAddMutation={this.handleAddMutation}
                  view={view}
                />
              ))}
            </Col>
          </Row>
    <StyledButton onClick={this.handleSave(updateSiteView, view)}>
      Save Site View
    </StyledButton>
        </Panel.Body>
      </Panel>

      );
  }
  renderAutoSuggestConfig=(showAutoSuggest,view,fields, crowdFields,updateSiteView )=>{
    console.log("Rendering AutoSuggest", AGGS_OPTIONS.concat(this.getCrowdFields(view)))
    return(
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
            </AggsHeaderContainer>
            <StyledLabel>Add to Autosuggest</StyledLabel>
            <MultiInput
              name="set:search.autoSuggest.fields"
              options={AGGS_OPTIONS}
              placeholder="Add facet"
              value={view.search.autoSuggest.fields}
              onChange={e => this.handleAddMutation(e, view)}
            />
          </Col>
        </Row>
  <StyledButton onClick={this.handleSave(updateSiteView, view)}>
    Save Site View
  </StyledButton>
      </Panel.Body>
    </Panel>
    );
}
renderPreSearchConfig=(showPresearch,view,fields, crowdFields,updateSiteView )=>{
  console.log("Rendering Presearchconfig")
  return(
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
  <Row>
    <Col md={6}>
      <AggsHeaderContainer>
        <h3>Aggs visibility</h3>
        <StyledCheckbox 
          checked={this.state.showAllAggsPresearch}
          onChange={this.handleShowAllToggle('aggsPresearch')}>
              Show all
            </StyledCheckbox>
          </AggsHeaderContainer>
          <StyledLabel>Filter</StyledLabel>
          <StyledFormControl
            name="set:search.presearch.aggs.selected.kind"
            componentClass="select"
            onChange={e => this.handleAddMutation(e, view)}
            value={view.search.presearch.aggs.selected.kind}>
            <option value="BLACKLIST">All except</option>
            <option value="WHITELIST">Only</option>
          </StyledFormControl>
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
              //@ts-ignore
              field={field}
              onAddMutation={this.handleAddMutation}
              view={view}
              presearch={true}
            />
          ))}
        </Col>
        <Col md={6}>
          <AggsHeaderContainer>
            <h3>Crowd aggs visibility</h3>
            <StyledCheckbox
              checked={this.state.showAllCrowdAggsPresearch}
              onChange={this.handleShowAllToggle('crowdAggsPresearch')}>
              Show all
            </StyledCheckbox>
          </AggsHeaderContainer>

          <StyledLabel>Filter</StyledLabel>
          <StyledFormControl
            name="set:search.presearch.crowdAggs.selected.kind"
            componentClass="select"
            onChange={(e: { currentTarget: { name: string; value: any; }; }) => this.handleAddMutation(e, view)}
            v={view.search.crowdAggs.selected.kind}>
            <option value="BLACKLIST">All except</option>
            <option value="WHITELIST">Only</option>
          </StyledFormControl>
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
              //@ts-ignore
              field={field}
              onAddMutation={this.handleAddMutation}
              view={view}
              presearch={true}
            />
          ))}
        </Col>
      </Row>
<StyledButton onClick={this.handleSave(updateSiteView, view)}>
  Save Site View
</StyledButton>
    </Panel.Body>
  </Panel>
  );
}
renderResultsConfig=(showResults,view,fields, crowdFields,updateSiteView )=>{
  return(
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
  <h3>Fields</h3>
<MultiInput
  name="set:search.fields"
  options={SEARCH_FIELDS}
  placeholder="Add field"
  draggable
  value={view.search.fields}
  onChange={e => this.handleAddMutation(e, view)}
/>
<StyledButtonGroup>
    <DropdownButton
      bsStyle="default"
      title="Result View"
      key="default"
      id="dropdown-basic-default"
      style={{margin: "1em 1em 1em 0"}} 
    >
      <MenuItem onClick={e => this.handleShowFacetBar(
        'card',
        view,
        'set:search.results.type'
      )}> 
        Card View</MenuItem>
      <MenuItem onClick={e => this.handleShowFacetBar(
        'table',
        view,
        'set:search.results.type'
      )}>Table View</MenuItem>
      <MenuItem divider />
      <MenuItem onClick={e => this.handleShowFacetBar(
        'map',
        view,
        'set:search.results.type'
      )}>Map View</MenuItem>
    </DropdownButton>
    <PanelGroup  id="accordion-uncontrolled"> 
    {this.renderResultsButtons(view)}
    <StyledButton style={{marginTop:"1em"}} onClick={()=>this.handleAddButton(view)}>
              Add Button
            </StyledButton>
    </PanelGroup> 

<StyledButton onClick={this.handleSave(updateSiteView, view)}>
  Save Site View
</StyledButton>
</StyledButtonGroup>
    </Panel.Body>
  </Panel>
  );
}
renderBreadCrumbsConfig=(showBreadCrumbs,view,fields, crowdFields,updateSiteView )=>{
  return(
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

<StyledButton onClick={this.handleSave(updateSiteView, view)}>
  Save Site View
</StyledButton>
    </Panel.Body>
  </Panel>
  );
}
  render() {
    const siteviewId = this.props.match.params.id;
    let view = this.props.siteViews.find(view => siteviewId == view.id);
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
        : view.search.presearch.aggs.selected.kind,
      this.state.showAllAggsPresearch ? [] : view.search.presearch.aggs.selected.values,
      view.search.presearch.aggs.fields
    );
    const crowdFieldsPresearch = displayFields(
      this.state.showAllCrowdAggsPresearch
        ? FilterKind.BLACKLIST
        : view.search.presearch.crowdAggs.selected.kind,
      this.state.showAllCrowdAggsPresearch ? [] : view.search.presearch.crowdAggs.selected.values,
      view.search.presearch.crowdAggs.fields
    );


    const showFacetBar = view.search.config.fields.showFacetBar;
    // const config = displayFields(
    //   this.state.showFacetBar
    //     ? false : view.search.config.showfacetBar,
    //     this.state.showFacetBar ? false : view.search.config.showFacetBar

    // );
    // console.log('Facet bar set to:', view.search.config.fields.showFacetBar);
    const showBreadCrumbs = view.search.config.fields.showBreadCrumbs;
    // console.log("Crumbs bar set to:",view.search.config.fields.showBreadCrumbs)
    const showAutoSuggest = view.search.config.fields.showAutoSuggest;
    // console.log("Crumbs bar set to:",view.search.config.fields.showAutoSuggest)
    const showResults = view.search.config.fields.showResults;
    // console.log("Results set to:",view.search.config.fields.showResults)
    const showPresearch = view.search.config.fields.showPresearch
    console.log("Presearch set to:",view.search.config.fields.showPresearch)
    console.log("Search form view", view);
    console.log("SF Fields",fields);
    return (
      <UpdateSiteViewMutation
        onCompleted={() =>
          this.props.history.push(`/sites/${site.id}/edit/siteviews`)
        }>
        {updateSiteView => (
          <StyledContainer>
            <span style={{
              display: "inline",
              width: "8em",
              fontSize: "2em"
            
            }}>
              Site Name: </span><StyledFormInput
              name={`set:name`}
              placeholder={view.name}
              value={view.name}
              onChange={e=>this.handleAddMutation(e,view)}
            />


            <span style={{
              display: "inline",
              width: "16em",
              fontSize: "2em"
            
            }}>URL: clinwiki.org/search/</span><StyledFormInput
              name={`set:url`}
              placeholder={view.url}
              value={view.url}
              onChange={e=>this.handleAddMutation(e,view)}
            />
            <h3>Search Sections</h3>
            <PanelGroup  id="accordion-uncontrolled"> 
                {this.renderFacetBarConfig(showFacetBar,view,fields, crowdFields,updateSiteView)}
                {this.renderAutoSuggestConfig(showAutoSuggest,view,fields, crowdFields,updateSiteView)}
                {this.renderPreSearchConfig(showPresearch,view,fieldsPresearch, crowdFieldsPresearch,updateSiteView)}
                {this.renderResultsConfig(showResults,view,fields, crowdFields,updateSiteView)}
                {this.renderBreadCrumbsConfig(showBreadCrumbs,view,fields, crowdFields,updateSiteView)}
              {/* <Panel eventKey="6">
                <Panel.Heading>
                  <Panel.Title toggle>Panel heading 2</Panel.Title>
                </Panel.Heading>
                <Panel.Body collapsible>Panel content 2</Panel.Body>
              </Panel> */}
            </PanelGroup>
            <StyledButton onClick={this.handleSave(updateSiteView, view)}>
              Save Site View
            </StyledButton>
          </StyledContainer>
        )}
      </UpdateSiteViewMutation>
    );
  }
}

export default SearchForm;
