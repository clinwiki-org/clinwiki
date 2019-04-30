import * as React from 'react';
import { CreateSiteInput } from 'types/globalTypes';
import { equals, pick, lens, lensPath, set, over, reject } from 'ramda';
import { Row, Col, FormControl, Button, Table } from 'react-bootstrap';
import styled from 'styled-components';
import { gql } from 'apollo-boost';

interface SiteFormProps {
  form?: CreateSiteInput;
  onSave: (form: CreateSiteInput) => void;
}

interface SiteFormState {
  form: CreateSiteInput;
  addEditorEmail: string;
  prevForm: CreateSiteInput | null;
}

const StyledContainer = styled.div`
  padding: 20px;
  h3,
  h5 {
    color: white;
  }
`;
const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
`;

const StyledLabel = styled.label`
  color: white;
`;

const AddEditorContainer = styled.div`
  display: flex;

  button {
    margin-left: 10px;
    margin-bottom: 20px;
  }
`;

const EditorActions = styled.td`
  display: flex;
  justify-content: flex-end;
`;

class SiteForm extends React.Component<SiteFormProps, SiteFormState> {
  state: SiteFormState = {
    form: {
      name: '',
      subdomain: '',
      editorEmails: [],
    },
    addEditorEmail: '',
    prevForm: null,
  };

  static fragment = gql`
    fragment SiteFormFragment on Site {
      name
      subdomain
      editors {
        email
      }
    }
  `;

  static getDerivedStateFromProps = (
    props: SiteFormProps,
    state: SiteFormState,
  ): SiteFormState | null => {
    if (props.form && !equals(props.form, state.prevForm)) {
      const form = pick(['name', 'subdomain', 'editorEmails'], props.form);
      return { ...state, form, prevForm: props.form };
    }
    return null;
  };

  handleSave = () => {
    this.props.onSave(this.state.form);
  };

  handleAddEditor = () => {
    if (!this.state.addEditorEmail) return;

    const editorsLens = lensPath([
      'editorEmails',
      (this.state.form.editorEmails || []).length,
    ]);
    const newForm = set(
      editorsLens,
      this.state.addEditorEmail,
      this.state.form,
    ) as any;

    this.setState({ form: newForm, addEditorEmail: '' });
  };

  handleDeleteEditor = (email: string) => () => {
    const editorsLens = lensPath(['editorEmails']);
    const newForm = over(
      editorsLens,
      reject(equals(email)),
      this.state.form,
    ) as any;
    this.setState({ form: newForm });
  };

  handleEditorEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ addEditorEmail: e.currentTarget.value });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    this.setState({ form: { ...this.state.form, [name]: value } });
  };

  renderEditors = () => {
    const noEditors =
      !this.state.form.editorEmails || !this.state.form.editorEmails.length;
    return (
      <div>
        <h3>Editors</h3>
        {noEditors && <h5>No editors</h5>}
        {!noEditors && (
          <Table striped bordered condensed>
            <thead>
              <tr>
                <th>Email</th>
                <th style={{ width: '20%' }} />
              </tr>
            </thead>
            <tbody>
              {(this.state.form.editorEmails || []).map(email => (
                <tr key={email}>
                  <td>{email}</td>
                  <EditorActions>
                    <Button onClick={this.handleDeleteEditor(email)}>
                      Delete
                    </Button>
                  </EditorActions>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <AddEditorContainer>
          <StyledFormControl
            name="editor"
            type="text"
            placeholder="Editor email"
            value={this.state.addEditorEmail}
            onChange={this.handleEditorEmailChange}
          />
          <Button onClick={this.handleAddEditor}>Add</Button>
        </AddEditorContainer>
      </div>
    );
  };

  render() {
    return (
      <StyledContainer>
        <Row>
          <Col md={4}>
            <StyledLabel htmlFor="name">Name</StyledLabel>
            <StyledFormControl
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              value={this.state.form.name}
              onChange={this.handleInputChange}
            />
            <StyledLabel htmlFor="subdomain">Subdomain</StyledLabel>
            <StyledFormControl
              id="subdomain"
              name="subdomain"
              type="text"
              placeholder="Subdomain"
              value={this.state.form.subdomain}
              onChange={this.handleInputChange}
            />
            {this.renderEditors()}
          </Col>
        </Row>
        <Button onClick={this.handleSave}>Save</Button>
      </StyledContainer>
    );
  }
}

export default SiteForm;
