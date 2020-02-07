import * as React from "react";
import { equals, prop, last } from "ramda";
import { FormControl, Button, Nav, NavItem } from "react-bootstrap";
import styled from "styled-components";
import { capitalize, trimPath } from "utils/helpers";
import { History, Location } from "history";
import { Switch, Route, match, Redirect } from "react-router";
import UpdateSiteViewMutation, {
  UpdateSiteViewMutationFn
} from "mutations/UpdateSiteViewMutation";
import SearchForm from "components/SiteForm/SearchForm";

const Container = styled.div`
  ul > li > a {
    color: white;

    &:hover {
      color: #333;
    }
  }
`;

const StyledNav = styled(Nav)`
  margin: 15px;
`;

interface SiteViewEditProps {
  match: any;
  history: History;
  location: Location;
  id: any;
  view: any;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
}

interface SiteViewEditState {}

class SiteViewEdit extends React.Component<
  SiteViewEditProps,
  SiteViewEditState
> {
  render() {
    const { name } = this.props.view;
    const { location } = this.props;
    return (
      <Container>
        <h3 style={{ color: "white", marginLeft: 15 }}>{name}</h3>
        <UpdateSiteViewMutation>
          {updateSiteView => (
            <SearchForm view={name} onAddMutation={this.props.onAddMutation} />
          )}
        </UpdateSiteViewMutation>
      </Container>
    );
  }
}

export default SiteViewEdit;
