import * as React from 'react';
import styled from 'styled-components';
import { Button, Checkbox, FormControl } from 'react-bootstrap';
import { SiteViewFragment } from 'types/SiteViewFragment';
import { withRouter } from 'react-router-dom';
import DeleteSiteViewMutation, {
  DeleteSiteViewMutationFn,
} from 'mutations/DeleteSiteViewMutation';
import { History, Location } from 'history';
import UpdateSiteViewMutation, {
  UpdateSiteViewMutationFn,
} from 'mutations/UpdateSiteViewMutation';
import { view, update } from 'ramda';
import { updateView } from 'utils/siteViewUpdater';

interface SiteViewItemProps {
  match: any;
  history: History;
  location: Location;
  refresh: () => void;
  siteView: SiteViewFragment;
}

interface SiteViewItemState {
  form: {
    siteViewName: string;
    siteViewPath: string;
  };
  rename: boolean;
}

const StyledButton = styled(Button)`
  margin-right: 15px;
`;

class SiteViewItem extends React.PureComponent<
  SiteViewItemProps,
  SiteViewItemState
> {
  state: SiteViewItemState = {
    form: {
      siteViewName: '',
      siteViewPath: '',
    },
    rename: false,
  };
  handleEditClick = () => {
    const siteViewId = this.props.siteView.id;
    const siteId = this.props.match.params.id;
    this.props.history.push(
      `/sites/${siteId}/edit/siteviews/${siteViewId}/edit`
    );
  };

  handleRenameClick = (updateSiteView: UpdateSiteViewMutationFn) => {
    const { siteView } = this.props;
    const { form, rename } = this.state;

    this.setState(
      {
        rename: true,
      },
      () => {
        updateSiteView({
          variables: {
            input: {
              id: siteView.id,
              name: form.siteViewName,
              url: form.siteViewPath,
              mutations: [],
            },
          },
        }).then(this.props.refresh());
      }
    );
    this.
    )
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

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      form: { ...this.state.form, [e.target.name as any]: e.target.value },
    });
  };

  render() {
    const { siteView } = this.props;
    const { rename } = this.state;
    return (
      <>
        {rename ? (
          <tr>
            <td>
              <FormControl
                name="siteViewName"
                placeholder="Site Name"
                value={siteView.name}
                onChange={this.handleInputChange}
              />
            </td>
            <td>
              <FormControl
                name="siteViewPath"
                placeholder="Site View Path"
                value={siteView.url}
                onChange={this.handleInputChange}
              />
            </td>
          </tr>
        ) : (
          <tr>
            <td>{siteView.name}</td>
            <td>{siteView.url}</td>
          </tr>
        )}
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
        <td>
          <StyledButton onClick={this.handleEditClick}>Edit</StyledButton>
          <DeleteSiteViewMutation>
            {deleteSiteView => (
              <StyledButton onClick={() => this.handleDelete(deleteSiteView)}>
                Delete
              </StyledButton>
            )}
          </DeleteSiteViewMutation>
          <StyledButton onClick={this.handleRenameClick}>Rename</StyledButton>
        </td>
      </>
    );
  }
}

//@ts-ignore
export default withRouter(SiteViewItem);
