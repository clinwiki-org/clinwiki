import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styled from 'styled-components';
import ThemedButton from 'components/StyledComponents';
import { Row, Col, FormControl, Nav, NavItem, Panel } from 'react-bootstrap';
import { fetchFacetConfig } from 'services/search/actions'
import { BeatLoader } from 'react-spinners';

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

  const dispatch = useDispatch();
  const [aggConfig, setConfig] = useState("");
  const [aggs, setAggs] = useState("");
  const facetConfig = useSelector((state: RootState) => state.search.facetConfig);


  useEffect(() => {
    dispatch(fetchFacetConfig());
  }, [dispatch]);

  useEffect(() => {
    let mainConfig = facetConfig && JSON.parse(facetConfig.data.facetConfig.mainConfig)

    facetConfig && setConfig(JSON.stringify(mainConfig.default[0]));
    facetConfig && setAggs(mainConfig.default);

  }, [facetConfig])

  if (!facetConfig) {
    return <BeatLoader />
  }

  let aggsArray = Object.keys(aggs)

  console.log(aggsArray)
  const handleSaveIsland = (e) => {
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
