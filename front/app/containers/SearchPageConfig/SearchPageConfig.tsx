import * as React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { Table, Button } from "react-bootstrap";
import { SitesPageQuery } from "types/SitesPageQuery";
import SiteItem from "components/SiteItem";
import CollapsiblePanel from "components/CollapsiblePanel";
import { History } from "history";
import DeleteSiteMutation, {
  DeleteSiteMutationFn
} from "mutations/DeleteSiteMutations";

interface SearchPageConfigProps {}

const QUERY = gql`
  query

`;

class QueryComponent extends Query<SearchPageConfigQuery> {}
