import * as React from 'react';
import styled from 'styled-components';
import { StyledContainer, StyledLabel } from './Styled';
import { CreateSiteInput } from 'types/globalTypes';
import { Checkbox, Row, Col, Button, Table } from 'react-bootstrap';
import StyledFormControl from 'containers/LoginPage/StyledFormControl';
import { set, lensPath, over, reject, equals } from 'ramda';

interface MainFormProps {
  form: CreateSiteInput;
  onFormChange: (form: CreateSiteInput) => void;
}

interface MainFormState {
  addEditorEmail: string;
}

export const AddEditorContainer = styled.div`
  display: flex;

  button {
    margin: 15px 0 15px 10px;
  }
`;

export const EditorActions = styled.td`
  display: flex;
  justify-content: flex-end;
`;

class MainForm extends React.Component<MainFormProps, MainFormState> {
  state: MainFormState = {
    addEditorEmail: '',
  };

  handleAddEditor = () => {
    if (!this.state.addEditorEmail) return;

    const editorsLens = lensPath([
      'editorEmails',
      (this.props.form.editorEmails || []).length,
    ]);
    const newForm = set(
      editorsLens,
      this.state.addEditorEmail,
      this.props.form
    ) as any;

    this.props.onFormChange(newForm);
    this.setState({ addEditorEmail: '' });
  };

  handleDeleteEditor = (email: string) => () => {
    const editorsLens = lensPath(['editorEmails']);
    const newForm = over(
      editorsLens,
      reject(equals(email)),
      this.props.form
    ) as any;

    this.props.onFormChange(newForm);
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    this.props.onFormChange({ ...this.props.form, [name]: value });
  };

  handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.currentTarget;
    this.props.onFormChange({ ...this.props.form, [name]: checked });
  };

  handleEditorEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ addEditorEmail: e.currentTarget.value });
  };

  render() {
    const noEditors =
      !this.props.form.editorEmails || !this.props.form.editorEmails.length;

    return (
      <StyledContainer>
        <Row>
          <Col md={6}>
            <h3>Site params</h3>
            <StyledLabel htmlFor="name">Name</StyledLabel>
            <StyledFormControl
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              value={this.props.form.name}
              onChange={this.handleInputChange}
            />
            <StyledLabel htmlFor="subdomain">Subdomain</StyledLabel>
            <StyledFormControl
              id="subdomain"
              name="subdomain"
              type="text"
              placeholder="Subdomain"
              value={this.props.form.subdomain}
              onChange={this.handleInputChange}
            />
            <StyledLabel htmlFor="subdomain">Skip landing page</StyledLabel>
            <Checkbox
              id="skipLanding"
              name="skipLanding"
              type="checkbox"
              checked={this.props.form.skipLanding}
              onClick={this.handleCheckboxChange}
            />
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
                    {(this.props.form.editorEmails || []).map(email => (
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
          </Col>
        </Row>
      </StyledContainer>
    );
  }
}

export default MainForm;
