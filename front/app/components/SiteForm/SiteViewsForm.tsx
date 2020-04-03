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
import {
  Table,
  FormControl,
  Checkbox,
  MenuItem,
  DropdownButton,
} from 'react-bootstrap';
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
  searchViewForm: {
    name: string;
    path: string;
  };
  userViewForm: {
    name: string;
    path: string;
  };
  adminViewForm: {
    name: string;
    path: string;
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
    searchViewForm: {
      name: '',
      path: '',
    },
    userViewForm: {
      name: '',
      path: '',
    },
    adminViewForm: {
      name: '',
      path: '',
    },
    id: undefined,
    textToCopy: '',
  };

  handleSave = (createSiteView: CreateSiteViewMutationFn, type: string) => {
    const { searchViewForm, userViewForm, adminViewForm } = this.state;
    let mutationArray: any[] = [
      { path: ['search', 'type'], operation: 'SET', payload: type },
    ];
    switch (type) {
      case 'search':
        if (searchViewForm.name === 'default') {
          alert(`Only the default site can have the url 'default'`);
          this.setState({
            searchViewForm: {
              name: '',
              path: '',
            },
          });
          return null;
        } else if (searchViewForm.name == '' || searchViewForm.path == '') {
          alert(`Name and URL are both required, please try again`);
          this.setState({
            searchViewForm: {
              name: '',
              path: '',
            },
          });
          return null;
        }
        createSiteView({
          variables: {
            input: {
              name: searchViewForm.name,
              url: searchViewForm.path,
              description: `search view ${this.props.site.id}`,
              default: false,
              mutations: mutationArray,
              siteId: this.props.site.id,
            },
          },
        }).then(res => {
          this.setState(
            {
              searchViewForm: {
                name: '',
                path: '',
              },
            },
            () => {
              this.props.refresh();
            }
          );
        });
        break;
      case 'user':
        createSiteView({
          variables: {
            input: {
              name: userViewForm.name,
              url: userViewForm.path,
              description: `user view ${this.props.site.id}`,
              default: false,
              mutations: mutationArray,
              siteId: this.props.site.id,
            },
          },
        }).then(res => {
          this.setState(
            {
              userViewForm: {
                name: '',
                path: '',
              },
            },
            () => {
              this.props.refresh();
            }
          );
        });

        break;
      case 'admin':
        createSiteView({
          variables: {
            input: {
              name: adminViewForm.name,
              url: adminViewForm.path,
              description: `admin view ${this.props.site.id}`,
              default: false,
              mutations: mutationArray,
              siteId: this.props.site.id,
            },
          },
        }).then(res => {
          this.setState(
            {
              adminViewForm: {
                name: '',
                path: '',
              },
            },
            () => {
              this.props.refresh();
            }
          );
        });
        break;
      default:
        return null;
    }
  };

  handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    // this.setState({
    //   form: { ...this.state.form, [e.target.name as any]: e.target.value },
    // });
    switch (type) {
      case 'search':
        this.setState({
          searchViewForm: {
            ...this.state.searchViewForm,
            [e.target.name as any]: e.target.value,
          },
        });
        break;
      case 'user':
        this.setState({
          userViewForm: {
            ...this.state.userViewForm,
            [e.target.name as any]: e.target.value,
          },
        });
        break;
      case 'admin':
        this.setState({
          adminViewForm: {
            ...this.state.adminViewForm,
            [e.target.name as any]: e.target.value,
          },
        });
        break;
      default:
        return null;
    }
  };
  componentDidMount() {
    this.props.handleForm();
  }
  render() {
    const { siteViews, refresh, site } = this.props;
    const { searchViewForm, userViewForm, adminViewForm } = this.state;
    const filteredSearchSites = () => {
      return filter(siteViews => siteViews.search.type == 'search', siteViews);
    };
    const filteredUserSites = () => {
      return filter(siteViews => siteViews.search.type == 'user', siteViews);
    };
    const filteredAdminSites = () => {
      return filter(siteViews => siteViews.search.type == 'admin', siteViews);
    };
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
                          refresh={refresh}
                          site={site}
                          type={'search'}
                        />
                      ))}
                    </>
                    <tr>
                      <td>
                        <FormControl
                          name="name"
                          placeholder="Search View Name"
                          value={searchViewForm.name}
                          onChange={e => this.handleInputChange(e, 'search')}
                        />
                      </td>
                      <td>
                        <FormControl
                          name="path"
                          placeholder="Search View Path"
                          value={searchViewForm.path}
                          onChange={e => this.handleInputChange(e, 'search')}
                        />
                      </td>
                      <td>
                        <Checkbox />
                      </td>

                      <td>
                        <StyledButton
                          onClick={() => {
                            this.handleSave(createSiteView, 'search');
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
                      {/* <th>Default?</th> */}
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
                          refresh={refresh}
                          site={site}
                          type={'user'}
                        />
                      ))}
                    </>
                    <tr>
                      <td>
                        <FormControl
                          name="name"
                          placeholder="User View Name"
                          value={userViewForm.name}
                          onChange={e => this.handleInputChange(e, 'user')}
                        />
                      </td>
                      <td>
                        <FormControl
                          name="path"
                          placeholder="User View Path"
                          value={userViewForm.path}
                          onChange={e => this.handleInputChange(e, 'user')}
                        />
                      </td>
                      <td>
                        <StyledButton
                          onClick={() => {
                            this.handleSave(createSiteView, 'user');
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
                      {/* <th>Default?</th> */}
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
                          refresh={refresh}
                          site={site}
                          type={'admin'}
                        />
                      ))}
                    </>
                    <tr>
                      <td>
                        <FormControl
                          name="name"
                          placeholder="Admin View Name"
                          value={adminViewForm.name}
                          onChange={e => this.handleInputChange(e, 'admin')}
                        />
                      </td>
                      <td>
                        <FormControl
                          name="path"
                          placeholder="Admin View Path"
                          value={adminViewForm.path}
                          onChange={e => this.handleInputChange(e, 'admin')}
                        />
                      </td>
                      <td>
                        <StyledButton
                          onClick={() => {
                            this.handleSave(createSiteView, 'admin');
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
