import * as React from 'react';
import styled from 'styled-components';
import {
  Button,
  Checkbox,
  FormControl,
  MenuItem,
  DropdownButton,
} from 'react-bootstrap';
import { SiteViewFragment } from 'types/SiteViewFragment';
import { withRouter } from 'react-router-dom';
import DeleteSiteViewMutation, {
  DeleteSiteViewMutationFn,
} from 'mutations/DeleteSiteViewMutation';
import { History, Location } from 'history';
import UpdateSiteViewMutation, {
  UpdateSiteViewMutationFn,
} from 'mutations/UpdateSiteViewMutation';
import CopySiteViewMutation, {
  CopySiteViewMutationFn,
} from 'mutations/CopySiteViewMutation';
import { Link } from 'react-router-dom';

interface SiteViewItemProps {
  match: any;
  history: History;
  location: Location;
  refresh: () => void;
  siteView: SiteViewFragment;
  site: any;
  type: string;
}

const StyledButton = styled(Button)`
  margin-right: 15px;
`;
// const PreviewText;
const siteViewTypes: any[] = ['admin', 'user', 'search'];

class SiteViewItem extends React.PureComponent<SiteViewItemProps> {
  handleEditClick = () => {
    const siteViewId = this.props.siteView.id;
    const siteId = this.props.match.params.id;
    this.props.history.push(
      `/sites/${siteId}/edit/siteviews/${siteViewId}/edit`
    );
  };

  handleCheckbox = (updateSiteView: UpdateSiteViewMutationFn) => {
    const { siteView } = this.props;
    if (siteView.default) {
      alert('There must be a default site view.');
      return null;
    }
    updateSiteView({
      variables: {
        input: {
          default: true,
          id: siteView.id,
          mutations: [],
          name: siteView.name,
        },
      },
    }).then(() => {
      this.props.refresh();
    });
  };

  handleDelete = (deleteSiteView: DeleteSiteViewMutationFn) => {
    const { siteView } = this.props;
    if (siteView.default) {
      alert('There must be a default site.');
      return null;
    }
    if (!window) return;
    if (window.confirm('Are you sure?')) {
      deleteSiteView({
        variables: {
          input: {
            id: siteView.id,
          },
        },
      }).then(res => {
        // console.log(res);
        this.props.refresh();
      });
    }
  };

  handleCopy = (copySiteView: CopySiteViewMutationFn) => {
    const { siteView, site } = this.props;
    const copiedName = `${siteView.name}copy`;
    const copiedUrl = `${siteView.url}copy`;
    copySiteView({
      variables: {
        input: {
          name: copiedName,
          url: copiedUrl,
          default: false,
          siteId: site.id,
          siteViewId: siteView.id,
        },
      },
    }).then(res => {
      this.props.refresh();
    });
  };

  renderDropDown = siteViewUrl => {
    if (siteViewUrl == 'default' || siteViewUrl == 'user') {
      return;
    }
    return (
      <UpdateSiteViewMutation>
        {updateSiteView => (
          <DropdownButton
            bsStyle="default"
            title="Change Type"
            key="default"
            id="dropdown-basic-default"
            style={{ margin: '1em 1em 1em 0' }}>
            {siteViewTypes.map(type => (
              <MenuItem
                key={type}
                name={`set:search.type`}
                onClick={e => this.handleChangeType(updateSiteView, type)}>
                {type}
              </MenuItem>
            ))}
          </DropdownButton>
        )}
      </UpdateSiteViewMutation>
    );
  };
  handleChangeType = (
    updateSiteView: UpdateSiteViewMutationFn,
    type: string
  ) => {
    const { siteView } = this.props;
    let mutationArray: any[] = [
      { path: ['search', 'type'], operation: 'SET', payload: type },
    ];
    if (siteView.default) {
      alert('There must be a default site.');
      return null;
    }

    updateSiteView({
      variables: {
        input: {
          default: false,
          id: siteView.id,
          mutations: mutationArray,
          url: `searchView${siteView.id}`,
        },
      },
    }).then(() => {
      console.log('refreshing');
      this.props.refresh();
    });
  };

  render() {
    const { siteView, site, type } = this.props;

    let urlString;
    if (site.subdomain != 'default') {
      urlString = `https://${site.subdomain}.clinwiki.org/search/${siteView.url}`;
    } else {
      urlString = `https://clinwiki.org/search/${siteView.url}`;
    }

    return (
      <tr>
        <td>{siteView.name}</td>
        <td>{siteView.url}</td>
        {type === 'search' && (
          <td>
            <UpdateSiteViewMutation>
              {updateSiteView => (
                <Checkbox
                  checked={siteView.default}
                  onChange={() => this.handleCheckbox(updateSiteView)}
                />
              )}
            </UpdateSiteViewMutation>
          </td>
        )}

        <td>
          <a target="_blank" href={urlString}>
            {urlString}
          </a>
        </td>
        <td>
          <StyledButton onClick={this.handleEditClick}>Edit</StyledButton>
          <CopySiteViewMutation>
            {copySiteView => (
              <StyledButton onClick={() => this.handleCopy(copySiteView)}>
                Copy
              </StyledButton>
            )}
          </CopySiteViewMutation>
          <DeleteSiteViewMutation>
            {deleteSiteView => (
              <StyledButton onClick={() => this.handleDelete(deleteSiteView)}>
                Delete
              </StyledButton>
            )}
          </DeleteSiteViewMutation>
          {this.renderDropDown(siteView.url)}
        </td>
      </tr>
    );
  }
}

//@ts-ignore
export default withRouter(SiteViewItem);
