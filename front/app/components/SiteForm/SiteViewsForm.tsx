import * as React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { SiteViewFragment } from "types/SiteViewFragment";
import {
  updateView,
  createMutation,
  getViewValueByPath
} from "utils/siteViewUpdater";
import { Switch, Route, match, Redirect } from "react-router";
import { Checkbox, Row, Col, Button, Table } from "react-bootstrap";
import { History, Location } from "history";

interface SiteViewsFormProps {
  view: SiteViewFragment;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
}

// interface SiteViewsFormState {

// }

class SiteViewsForm extends React.Component<SiteViewsFormProps> {
  render() {
    return <div></div>;
  }
}

export default SiteViewsForm;
