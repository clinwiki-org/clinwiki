import React from 'react';
import styled from 'styled-components';
import GenericForm from 'components/GenericForm'

interface EditWorkflowsPageProps { }
interface EditWorkflowsPageState {
  currentAggName: string | null;
}

const Container = styled.div`
  padding: 15px;
`;

function EditAggIslandsPage(props: EditWorkflowsPageProps) {

    return (
      <Container>
        <GenericForm tableName="island_configs" />
      </Container>
    )
}

export default EditAggIslandsPage;
