import * as React from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { SiteViewFragment } from 'types/SiteViewFragment';
import CollapsiblePanel from 'components/CollapsiblePanel';
import { filter } from 'ramda';
import { SiteViewItem } from 'components/SiteItem';
import CreateSiteViewMutation, {
  CreateSiteViewMutationFn,
} from 'mutations/CreateSiteViewMutation';
import { Table, FormControl, Checkbox, MenuItem, DropdownButton } from 'react-bootstrap';
import { History, Location } from 'history';
import { CreateSiteViewInput, SiteViewMutationInput } from 'types/globalTypes';
import StyledButton from 'containers/LoginPage/StyledButton';

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
    const filteredSearchSites = () =>{
        return filter(
        siteViews => siteViews.search.type == "search",
         siteViews
       );
      }
    const filteredUserSites = () =>{
        return filter(
        siteViews => siteViews.search.type == "user",
         siteViews
       );
      }
    const filteredAdminSites = () =>{
        return filter(
        siteViews => siteViews.search.type == "admin",
         siteViews
       );
      }
    
    return (
      <CreateSiteViewMutation>
        {createSiteView => (
          <StyledContainer>
            <CollapsiblePanel header="Site Views">
              {siteViews.length > 0 && (
                <Table striped bordered condensed>
                  <thead>
                    <tr>
                      <th>Site Name</th>
                      <th>URL</th>
                      <th>Default?</th>
                      <th>Siteview Type</th>
                      <th>URL Preview</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <>
                      {filteredSearchSites().map(view => (
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
                        <StyledButton
                          onClick={() => {
                            this.handleSave(createSiteView);
                          }}>
                          + Add Site View
                        </StyledButton>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </CollapsiblePanel>
            <CollapsiblePanel header="User Views">
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
                      {filteredUserSites().map(view => (
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
                        <StyledButton
                          onClick={() => {
                            this.handleSave(createSiteView);
                          }}>
                          + Add Site View
                        </StyledButton>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </CollapsiblePanel>

            <CollapsiblePanel header="Admin Views">
              {siteViews.length > 0 && (
                <Table striped bordered condensed>
                  <thead>
                    <tr>
                      <th>Site Name</th>
                      <th>URL</th>
                      <th>Default?</th>
                      <th>Siteview Type</th>
                      <th>URL Preview</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <>
                      {filteredAdminSites().map(view => (
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
                        <StyledButton
                          onClick={() => {
                            this.handleSave(createSiteView);
                          }}>
                          + Add Site View
                        </StyledButton>
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
