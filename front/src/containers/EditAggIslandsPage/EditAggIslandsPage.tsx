import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import ThemedButton from 'components/StyledComponents';
import { Checkbox, Row, Col, Table, FormControl, Nav, NavItem, Panel } from 'react-bootstrap';

interface EditWorkflowsPageProps { }
interface EditWorkflowsPageState {
  currentAggName: string | null;
}

const Container = styled.div`
  padding: 15px;
`;

const StyledPanel = styled(Panel)`
  padding: 15px;
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

function EditAggIslandsPage(props: EditWorkflowsPageProps) {
  const [aggConfig, setConfig]= useState("");

  const currentAgg = {
    aggSublabel: null,
    autoSuggest: false,
    bucketKeyValuePairs: null,
    defaultToOpen: null,
    display: "STRING",
    displayName: "overall_status",
    layout: "horizontal",
    maxCrumbs: null,
    name: "overall_status",
    order: { sortKind: "key", desc: true },
    preselected: { kind: "WHITELIST", values: Array(0) },
    rangeEndLabel: null,
    rangeStartLabel: null,
    rank: null,
    showAllowMissing: null,
    showFilterToolbar: null,
    visibleOptions: { kind: "WHITELIST", values: Array(0) },
    aggKind: "aggs"
  }

  useEffect(()=>{

    setConfig(JSON.stringify(currentAgg));

  }, [])
  let aggs =
  {
    0: {
      aggSublabel: null,
      autoSuggest: false,
      bucketKeyValuePairs: null,
      defaultToOpen: null,
      display: "STRING",
      displayName: "overall_status",
      layout: "horizontal",
      maxCrumbs: null,
      name: "overall_status",
      order: { sortKind: "key", desc: true },
      preselected: { kind: "WHITELIST", values: Array(0) },
      rangeEndLabel: null,
      rangeStartLabel: null,
      rank: null,
      showAllowMissing: null,
      showFilterToolbar: null,
      visibleOptions: { kind: "WHITELIST", values: Array(0) },
      aggKind: "aggs"
    },
    1: {
      aggSublabel: null,
      autoSuggest: false,
      bucketKeyValuePairs: null,
      defaultToOpen: null,
      display: "STRING",
      displayName: "city",
      layout: "horizontal",
      maxCrumbs: null,
      name: "city",
      order: { sortKind: "key", desc: true },
      preselected: { kind: "WHITELIST", values: Array(0) },
      rangeEndLabel: null,
      rangeStartLabel: null,
      rank: null,
      showAllowMissing: null,
      showFilterToolbar: null,
      visibleOptions: { kind: "WHITELIST", values: Array(0) },
      aggKind: "aggs"
    },

  };
  let aggsArray = Object.keys(aggs)

  console.log(aggsArray)
  const handleSaveIsland =(e)=>{
    console.log("Save Isalnd Mutation", e.currentTarget)
  }
  if (aggs == null)
    return (
      <Container>
        <Row>No Aggs</Row>
      </Container>
    );
  else
    return (
      <Container>
        <Row>
          <Col md={2}>
            <Nav
              bsStyle="pills"
              stacked
              activeKey={null}
              onSelect={console.log("selected")}>
              {
                aggsArray.map(agg => (console.log(agg),
                  <NavItem key={agg} eventKey={agg} >
                    {agg}
                  </NavItem>
                ))}

            </Nav>
          </Col>
          <Col md={10}>
            <StyledPanel>
              <div>Our Config goes here</div>

              {/* <EditIslandForm/> */}

              <StyledFormInput
                componentClass="textarea"
                name="reactionsConfig"
                placeholder={"SOmething"}
                value={aggConfig}
                onChange={setConfig}
              />
              <ThemedButton
                style={{ marginTop: 15 }}
                onClick={(e) => handleSaveIsland}>
                Save
                </ThemedButton>

            </StyledPanel>
          </Col>
        </Row>
      </Container>
    )
}

export default EditAggIslandsPage;
