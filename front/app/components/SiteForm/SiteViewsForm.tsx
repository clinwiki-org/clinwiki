import * as React from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { SiteViewFragment } from 'types/SiteViewFragment';
import CollapsiblePanel from 'components/CollapsiblePanel';

import { SiteViewItem } from 'components/SiteItem';
import CreateSiteViewMutation, {
  CreateSiteViewMutationFn,
} from 'mutations/CreateSiteViewMutation';
import { Table, FormControl, Checkbox } from 'react-bootstrap';
import { History, Location } from 'history';
import { CreateSiteViewInput, SiteViewMutationInput } from 'types/globalTypes';
// import StyledButton from 'containers/LoginPage/StyledButton';
import ThemedButton from 'components/StyledComponents/index';

interface SiteViewsFormProps {
  site: any;
  siteViews: SiteViewFragment[];
  refresh: any;
  handleForm: any;
}

interface SiteViewsFormState {
  form: {
    siteViewName: string;
    siteViewPath: string;
  };
  id: string | undefined;
  textToCopy: string;
}

const StyledContainer = styled.div`
  padding: 20px;
  h3,
  h4,
  h5 {
    color: white;
  }
`;

const SiteViewsTable = styled.div`
  display: flex;
`;

class SiteViewsForm extends React.Component<
  SiteViewsFormProps,
  SiteViewsFormState
> {
  state: SiteViewsFormState = {
    form: {
      siteViewName: '',
      siteViewPath: '',
    },
    id: undefined,
    textToCopy: '',
  };

  handleSave = (createSiteView: CreateSiteViewMutationFn) => {
    const { form } = this.state;
    if (form.siteViewPath === 'default') {
      alert(`Only the default site can have the url 'default'`);
      this.setState({
        form: {
          siteViewName: '',
          siteViewPath: '',
        },
      });
      return null;
    } else if (form.siteViewName == '' || form.siteViewPath == '') {
      alert(`Name and URL are both required, please try again`);
      this.setState({
        form: {
          siteViewName: '',
          siteViewPath: '',
        },
      });
      return null;
    }
    createSiteView({
      variables: {
        input: {
          name: form.siteViewName,
          url: form.siteViewPath,
          description: 'description',
          default: false,
          mutations: [],
          siteId: this.props.site.id,
        },
      },
    }).then(res => {
      this.setState(
        {
          form: {
            siteViewName: '',
            siteViewPath: '',
          },
        },
        () => {
          this.props.refresh();
        }
      );
    });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      form: { ...this.state.form, [e.target.name as any]: e.target.value },
    });
  };
  componentDidMount() {
    this.props.handleForm();
  }
  render() {
    const { siteViews } = this.props;
    return (
      <CreateSiteViewMutation>
        {createSiteView => (
          <StyledContainer>
            <CollapsiblePanel header="My Site Views">
              {siteViews.length > 0 && (
                <Table striped bordered condensed>
                  <thead>
                    <tr>
                      <th>Site Name</th>
                      <th>URL</th>
                      <th>Default?</th>
                      <th>URL Preview</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <>
                      {siteViews.map(view => (
                        <SiteViewItem
                          key={view.id}
                          siteView={view}
                          refresh={this.props.refresh}
                          site={this.props.site}
                        />
                      ))}
                    </>
                    <tr>
                      <td>
                        <FormControl
                          name="siteViewName"
                          placeholder="Site Name"
                          value={this.state.form.siteViewName}
                          onChange={this.handleInputChange}
                        />
                      </td>
                      <td>
                        <FormControl
                          name="siteViewPath"
                          placeholder="Site View Path"
                          value={this.state.form.siteViewPath}
                          onChange={this.handleInputChange}
                        />
                      </td>
                      <td>
                        <Checkbox />
                      </td>
                      <td>
                        <ThemedButton
                          onClick={() => {
                            this.handleSave(createSiteView);
                          }}>
                          + Add Site View
                        </ThemedButton>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </CollapsiblePanel>
          </StyledContainer>
        )}
      </CreateSiteViewMutation>
    );
  }
}

export default SiteViewsForm;
