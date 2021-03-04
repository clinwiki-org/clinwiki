import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styled from 'styled-components';
import ThemedButton from 'components/StyledComponents';
import { Row, Col, FormControl, Nav, NavItem, Panel } from 'react-bootstrap';
import { fetchFacetConfig, updateFacetConfig } from 'services/search/actions'
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
  min-height: 8em;
`;

function EditAggIslandsPage(props: EditWorkflowsPageProps) {

  const dispatch = useDispatch();
  const [aggConfig, setConfig] = useState("");
  const [aggs, setAggs] = useState("");
  const [currentAggId, setCurrentAggId] = useState("")
  const facetConfig = useSelector((state: RootState) => state.search.facetConfig);


  useEffect(() => {
  dispatch(fetchFacetConfig());
  }, [dispatch]);

  useEffect(() => {
    let mainConfig = facetConfig && JSON.parse(facetConfig.data.facetConfig.mainConfig)

    facetConfig && setConfig(JSON.stringify(mainConfig.default[0]));
    facetConfig && setAggs(mainConfig.default);
    facetConfig && setCurrentAggId("0")

  }, [facetConfig])
  useEffect(() => {
    let mainConfig = facetConfig && JSON.parse(facetConfig.data.facetConfig.mainConfig)

    facetConfig && setConfig(JSON.stringify(mainConfig.default[currentAggId]));
    facetConfig && setAggs(mainConfig.default);
    // facetConfig && setCurrentAggId("0")

  }, [currentAggId])

  if (!facetConfig) {
    return <BeatLoader />
  }

  let aggsArray = Object.keys(aggs)

  const handleSaveIsland = (e) => {
    let mainConfig = facetConfig && JSON.parse(facetConfig.data.facetConfig.mainConfig);
    mainConfig.default[currentAggId] = JSON.parse(aggConfig);

    let variables = {
      jsonObj: JSON.stringify(mainConfig),
      clientMutationId: null
    }

    dispatch(updateFacetConfig({ input: variables }))


  }
  const handleConfigChange = (e) => {
    setConfig(e.target.value)
  }
  const handleNewFacet = (e) => {
    let mainConfig = facetConfig && JSON.parse(facetConfig.data.facetConfig.mainConfig);
    let mainDefaultString = facetConfig && JSON.stringify(mainConfig);
    let index = Object.keys(aggs).length

    mainDefaultString = mainDefaultString.slice(0, mainDefaultString.length - 2) + `, "${index}" : ${aggConfig} }}`;

    let newDefaultObject = JSON.parse(mainDefaultString)
    mainConfig = {
      ...mainConfig,
      default: newDefaultObject.default
    }

    let variables = {
      jsonObj: JSON.stringify(mainConfig),
      clientMutationId: null
    }

    dispatch(updateFacetConfig({ input: variables }))

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
              activeKey={currentAggId}
              onSelect={key => setCurrentAggId(key)}>
              {
                aggsArray.map(agg => (console.log(agg),
                  <NavItem key={agg} eventKey={agg} >
                    {agg}
                  </NavItem>
                ))}
              <ThemedButton
                style={{ marginTop: 15 }}
                onClick={(handleNewFacet)}>
                New Facet
                </ThemedButton>
            </Nav>
          </Col>
          <Col md={10}>
            <StyledPanel>

              <StyledFormInput
                componentClass="textarea"
                name="reactionsConfig"
                placeholder={"SOmething"}
                value={aggConfig}
                onChange={(e) => handleConfigChange(e)}
              />
              <ThemedButton
                style={{ marginTop: 15 }}
                onClick={(e) => handleSaveIsland(e)}>
                Save
                </ThemedButton>

            </StyledPanel>
          </Col>
        </Row>
      </Container>
    )
}

export default EditAggIslandsPage;
