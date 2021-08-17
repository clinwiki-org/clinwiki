import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styled from 'styled-components';
import ThemedButton from 'components/StyledComponents';
import { Row, Col, FormControl, Nav, NavItem, Panel } from 'react-bootstrap';
import { fetchIslandConfig, updateFacetConfig } from 'services/search/actions'
import { BeatLoader } from 'react-spinners';
import { isAdmin } from 'utils/auth';
import { Redirect } from 'react-router-dom'


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
  const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
  const user = useSelector((state: RootState) => state.user.current);


  useEffect(() => {
    dispatch(fetchIslandConfig());
    setCurrentAggId("3")
  }, [dispatch]);

  useEffect(() => {
    let mainConfig = islandConfig && islandConfig;
    islandConfig && setConfig(JSON.stringify(mainConfig[currentAggId]));
    islandConfig && setAggs(mainConfig);
  }, [dispatch, islandConfig, currentAggId])

  if (!islandConfig) {
    return <BeatLoader />
  }

  let aggsArray = Object.keys(aggs)

  const handleSaveIsland = (e) => {
    let mainConfig = islandConfig && islandConfig.islandConfig.mainConfig;
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
    let mainConfig = islandConfig
    let index = Object.keys(aggs).length
    let mainDefaultString = islandConfig && JSON.stringify(mainConfig);
    let newDefaultObject = JSON.parse(mainDefaultString)
    mainConfig = {
      ...mainConfig,
      default: newDefaultObject.default
    }

    let variables = {
      jsonObj: JSON.stringify(aggConfig),
      clientMutationId: null
    }

    dispatch(updateFacetConfig({ input: variables }))

  }
  if (!isAdmin(user)) {
    return <Redirect to='/' />
  } else {
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
}

export default EditAggIslandsPage;
