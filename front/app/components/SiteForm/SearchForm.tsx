import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { SiteViewFragment } from "types/SiteViewFragment";
import { displayFields } from "utils/siteViewHelpers";
import { StyledContainer, StyledFormControl, StyledLabel } from "./Styled";
import MultiInput from "components/MultiInput";
import AggField from "./AggField";
import { sentanceCase } from "utils/helpers";
import { aggsOrdered, studyFields } from "utils/constants";
import aggToField from "utils/aggs/aggToField";
import { FilterKind } from "types/globalTypes";
import { Checkbox } from "react-bootstrap";
import styled from "styled-components";
import { match } from "react-router";
import { Button } from "react-bootstrap";
import { CreateSiteInput, SiteViewMutationInput } from "types/globalTypes";
import UpdateSiteViewMutation, {
  UpdateSiteViewMutationFn
} from "mutations/UpdateSiteViewMutation";
import {
  updateView,
  createMutation,
  getViewValueByPath,
  serializeMutation
} from "utils/siteViewUpdater";
import { equals, prop, last } from "ramda";
import { History, Location } from "history";

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
  mutations: SiteViewMutationInput[];
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

class SearchForm extends React.Component<SearchFormProps, SearchFormState> {
  state: SearchFormState = {
    showAllAggs: false,
    showAllCrowdAggs: false,
    mutations: []
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
          default: true
        }
      }
    });
  };

  handleAddMutation = (
    e: { currentTarget: { name: string; value: any } },
    siteView
  ) => {
    console.log(e);
    const { name, value } = e.currentTarget;
    const mutation = createMutation(name, value);
    const view = updateView(siteView, this.state.mutations);
    const currentValue = getViewValueByPath(mutation.path, view);
    if (equals(value, currentValue)) return;
    this.setState({ mutations: [...this.state.mutations, mutation] }, () =>
      console.log("handleadd", mutation, view, currentValue)
    );
  };

  getCrowdFields = view => {
    return view.search.crowdAggs.fields.map(field => ({
      id: field.name,
      label: sentanceCase(field.name),
    }));
  };

  handleShowAllToggle = (kind: "aggs" | "crowdAggs") => () => {
    if (kind == "aggs") {
      this.setState({ showAllAggs: !this.state.showAllAggs });
    } else {
      this.setState({ showAllCrowdAggs: !this.state.showAllCrowdAggs });
    }
  };

  handleFieldsOrderChange = () => {};

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
    console.log(this.props.match, this.props.location, this.props.history);
    const url = this.props.match.path.slice();
    return (
      <UpdateSiteViewMutation
        onCompleted={() =>
          this.props.history.push(`/sites/${site.id}/edit/siteviews`)
        }
      >
        {updateSiteView => (
          <StyledContainer>
            <h1>{view.name}</h1>
            <h3>Fields</h3>
            <MultiInput
              name="set:search.fields"
              options={SEARCH_FIELDS}
              placeholder="Add field"
              draggable
              value={view.search.fields}
              onChange={e => this.handleAddMutation(e, view)}
            />
            <Row>
              <Col md={6}>
                <AggsHeaderContainer>
                  <h3>Aggs visibility</h3>
                  <StyledCheckbox
                    checked={this.state.showAllAggs}
                    onChange={this.handleShowAllToggle("aggs")}
                  >
                    Show all
                  </StyledCheckbox>
                </AggsHeaderContainer>
                <StyledLabel>Filter</StyledLabel>
                <StyledFormControl
                  name="set:search.aggs.selected.kind"
                  componentClass="select"
                  onChange={e => this.handleAddMutation(e, view)}
                  value={view.search.aggs.selected.kind}
                >
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
                    onChange={this.handleShowAllToggle("crowdAggs")}
                  >
                    Show all
                  </StyledCheckbox>
                </AggsHeaderContainer>

                <StyledLabel>Filter</StyledLabel>
                <StyledFormControl
                  name="set:search.crowdAggs.selected.kind"
                  componentClass="select"
                  onChange={e => this.handleAddMutation(e, view)}
                  v={view.search.crowdAggs.selected.kind}
                >
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
          </StyledContainer>
        )}
      </UpdateSiteViewMutation>
    );
  }
}

export default SearchForm;
