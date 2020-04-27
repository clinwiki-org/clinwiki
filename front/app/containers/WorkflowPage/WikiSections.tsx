import * as React from 'react';
import styled from 'styled-components';
import { ThemedButton } from '../../components/StyledComponents';
import { WikiSection } from 'utils/helpers';
import { Button, FormControl, Panel } from 'react-bootstrap';
import UpdateWikiSectionsMutation, {
  UpdateWikiSectionsMutationFn,
} from 'mutations/UpdateWikiSectionsMutation';
import {
  map,
  addIndex,
  find,
  propEq,
  isNil,
  keys,
  equals,
  isEmpty,
} from 'ramda';

interface WikiSectionsProps {
  nctId: string;
  sections: WikiSection[];
  disabled: boolean;
}

interface WikiSectionsState {
  updatedSections: { [key: string]: string };
  prevSections: WikiSection[] | null;
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledPanel = styled(Panel)`
  padding: 16px;
`;

class WikiSections extends React.Component<
  WikiSectionsProps,
  WikiSectionsState
> {
  state: WikiSectionsState = { updatedSections: {}, prevSections: null };

  handleSectionChange = (name: string) => (e: {
    currentTarget: { value: string };
  }) => {
    this.setState({
      updatedSections: {
        ...this.state.updatedSections,
        [name]: e.currentTarget.value,
      },
    });
  };

  handleSectionsSave = (
    updateWikiSections: UpdateWikiSectionsMutationFn
  ) => () => {
    updateWikiSections({
      variables: {
        input: {
          nctId: this.props.nctId,
          sections: keys(this.state.updatedSections).map(key => ({
            name: key,
            content: this.state.updatedSections[key],
          })),
        },
      },
    }).then(() => this.setState({ updatedSections: {} }));
  };

  renderWikiSection = (
    section: WikiSection,
    sections: WikiSection[],
    disabled: boolean
  ) => {
    let value = this.state.updatedSections[section.name];
    if (isNil(value)) {
      const foundSection = find(
        propEq('name', section.name),
        sections
      ) as WikiSection;
      value = foundSection.content;
    }

    return (
      <React.Fragment key={section.name}>
        <h3>{section.name}</h3>
        {!disabled && (
          <FormControl
            componentClass="textarea"
            placeholder="Add a description"
            rows={5}
            value={value}
            onChange={this.handleSectionChange(section.name)}
          />
        )}
        {disabled && <StyledPanel>{value}</StyledPanel>}
      </React.Fragment>
    );
  };

  render() {
    if (this.props.sections.length == 0) return null;

    return (
      <>
        {addIndex(map)((section, _, sections) =>
          this.renderWikiSection(
            section as WikiSection,
            sections as WikiSection[],
            this.props.disabled
          )
        )(this.props.sections)}
        {!this.props.disabled && (
          <ButtonContainer>
            <UpdateWikiSectionsMutation>
              {mutate => (
                <ThemedButton
                  onClick={this.handleSectionsSave(mutate)}
                  style={{ marginTop: 15 }}
                  disabled={isEmpty(this.state.updatedSections)}>
                  Save Sections
                </ThemedButton>
              )}
            </UpdateWikiSectionsMutation>
          </ButtonContainer>
        )}
      </>
    );
  }
}

export default WikiSections;
