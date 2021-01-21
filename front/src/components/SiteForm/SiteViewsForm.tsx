import * as React from 'react';
import styled from 'styled-components';
import { SiteViewFragment } from 'services/site/model/SiteViewFragment';
import CollapsiblePanel from 'components/CollapsiblePanel';
import { filter } from 'ramda';
import { SiteViewItem } from 'components/SiteItem';
import {
  Table,
  FormControl,
  Checkbox,
} from 'react-bootstrap';
import ThemedButton from 'components/StyledComponents/index';
import withTheme from 'containers/ThemeProvider/ThemeProvider';
import { connect } from 'react-redux';
import { createSiteView, fetchSiteProvider } from 'services/site/actions';


interface SiteViewsFormProps {
  site: any;
  siteViews: SiteViewFragment[];
  theme: any;
  fetchSiteProvider: any;
  createSiteView: any;
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
  interventionViewForm: {
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
    interventionViewForm: {
      name: '',
      path: '',
    },
    id: undefined,
    textToCopy: '',
  };

  handleSave = ( type: string) => {
    const { searchViewForm, userViewForm, adminViewForm } = this.state;
    let input = {};
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
        } else if (searchViewForm.name === '' || searchViewForm.path === '') {
          alert(`Name and URL are both required, please try again`);
          this.setState({
            searchViewForm: {
              name: '',
              path: '',
            },
          });
          return null;
        }
        input = {
          name: searchViewForm.name,
          url: searchViewForm.path,
          description: `search view ${this.props.site.id}`,
          default: false,
          mutations: mutationArray,
          siteId: this.props.site.id,
        }
        this.props.createSiteView( this.props.site.id,  input )
          this.setState(
            {
              searchViewForm: {
                name: '',
                path: '',
              },
            },
          );
        break;

      case 'user':
        input = {
          name: userViewForm.name,
          url: userViewForm.path,
          description: `user view ${this.props.site.id}`,
          default: false,
          mutations: mutationArray,
          siteId: this.props.site.id,
        }
        this.props.createSiteView( this.props.site.id,  input )
          this.setState(
            {
              userViewForm: {
                name: '',
                path: '',
              },
            },
          );
        break;
      case 'admin':
        input = {
          name: adminViewForm.name,
          url: adminViewForm.path,
          description: `admin view ${this.props.site.id}`,
          default: false,
          mutations: mutationArray,
          siteId: this.props.site.id,
        }
        this.props.createSiteView( this.props.site.id,  input )
          this.setState(
            {
              adminViewForm: {
                name: '',
                path: '',
              },
            },
          );
        break;

      case 'intervention':
        input = {
          name: userViewForm.name,
          url: userViewForm.path,
          description: `intervention view ${this.props.site.id}`,
          default: false,
          mutations: mutationArray,
          siteId: this.props.site.id,
        }
        this.props.createSiteView( this.props.site.id,  input )
          this.setState(
            {
              userViewForm: {
                name: '',
                path: '',
              },
            },
          );
        break;
        
      default:
        return null;
    }
    return null;
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
  render() {
    const { siteViews, site } = this.props;
    const {
      searchViewForm,
      userViewForm,
      adminViewForm,
      interventionViewForm,
    } = this.state;
    const filteredSearchSites = () => {
      return filter(siteViews => siteViews.search.type === 'search', siteViews);
    };
    const filteredUserSites = () => {
      return filter(siteViews => siteViews.search.type === 'user', siteViews);
    };
    const filteredAdminSites = () => {
      return filter(siteViews => siteViews.search.type === 'admin', siteViews);
    };
    const filteredInterventionSites = () => {
      return filter(
        siteViews => siteViews.search.type === 'intervention',
        siteViews
      );
    };
    return (
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
                          site={site}
                          type={'search'}
                          theme={this.props.theme}
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
                        <ThemedButton
                          onClick={() => {
                            this.handleSave('search');
                          }}>
                          + Add Site View
                        </ThemedButton>
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
                          site={site}
                          type={'user'}
                          theme={this.props.theme}
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
                        <ThemedButton
                          onClick={() => {
                            this.handleSave( 'user');
                          }}>
                          + Add Site View
                        </ThemedButton>
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
                          site={site}
                          type={'admin'}
                          theme={this.props.theme}
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
                        <ThemedButton
                          onClick={() => {
                            this.handleSave('admin');
                          }}>
                          + Add Site View
                        </ThemedButton>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </CollapsiblePanel>
            <CollapsiblePanel header="Intervention Views">
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
                      {filteredInterventionSites().map(view => (
                        <SiteViewItem
                          key={view.id}
                          siteView={view}
                          site={site}
                          type={'intervention'}
                          theme={this.props.theme}
                        />
                      ))}
                    </>
                    <tr>
                      <td>
                        <FormControl
                          name="name"
                          placeholder="Intervention View Name"
                          value={interventionViewForm.name}
                          onChange={e =>
                            this.handleInputChange(e, 'intervention')
                          }
                        />
                      </td>
                      <td>
                        <FormControl
                          name="path"
                          placeholder="Intervention View Path"
                          value={interventionViewForm.path}
                          onChange={e =>
                            this.handleInputChange(e, 'intervention')
                          }
                        />
                      </td>
                      <td>
                        <ThemedButton
                          onClick={() => {
                            this.handleSave('intervention');
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
    );
  }
}



const mapDispatchToProps = (dispatch) => ({
  fetchSiteProvider: (id?, url?) => dispatch(fetchSiteProvider(id, url)),
  createSiteView: ( id, input ) => dispatch(createSiteView(id, input)),
})


export default connect(null, mapDispatchToProps) (withTheme(SiteViewsForm));
