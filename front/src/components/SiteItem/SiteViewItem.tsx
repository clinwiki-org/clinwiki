import * as React from 'react';
import styled from 'styled-components';
import { Checkbox, MenuItem, DropdownButton } from 'react-bootstrap';
import { SiteViewFragment } from 'services/site/model/SiteViewFragment';
import { withRouter } from 'react-router-dom';
import { History, Location } from 'history';
import 'override.css';
import ThemedButton from 'components/StyledComponents/index';
import { connect } from 'react-redux';
import { copySiteView, deleteSiteView, fetchSiteProvider, updateSiteView } from 'services/site/actions';
import { BeatLoader } from 'react-spinners';

interface SiteViewItemProps {
  match: any;
  history: History;
  location: Location;
  siteView: SiteViewFragment;
  site: any;
  type: string;
  theme?: any;
  fetchSiteProvider: any;
  isReloading: any;
  copySiteView: any;
  updateSiteView: any;
  deleteSiteView: any;
}

const StyledButton = styled(ThemedButton)`
  margin-right: 15px;
`;

// const PreviewText;
const siteViewTypes: any[] = ['admin', 'user', 'search', 'intervention'];

class SiteViewItem extends React.PureComponent<SiteViewItemProps> {
  handleEditClick = () => {
    const siteViewId = this.props.siteView.id;
    const siteId = this.props.match.params.id;
    this.props.history.push(
      `/sites/${siteId}/edit/siteviews/${siteViewId}/edit`
    );
  };

  handleCheckbox = () => {
    const { site, siteView } = this.props;
    if (siteView.default) {
      alert('There must be a default site view.');
      return null;
    }
    let input = {
      default: true,
      id: siteView.id,
      mutations: [],
      name: siteView.name,
    }
    this.props.updateSiteView(site.id, input);
  };

  handleChangeType = ( type: string ) => {
    const { site, siteView } = this.props;
    let mutationArray: any[] = [
      { path: ['search', 'type'], operation: 'SET', payload: type },
    ];
    if (siteView.default) {
      alert('There must be a default site.');
      return null;
    }
    let input =  {
      default: false,
      id: siteView.id,
      mutations: mutationArray,
      url: siteView.url,
    }
    this.props.updateSiteView(site.id, input);
  };

  handleDelete = () => {
    const { siteView } = this.props;
    if (siteView.default) {
      alert('There must be a default site.');
      return null;
    }
    if (!window) return;
    if (window.confirm('Are you sure?')) {
      let input = {
        id: siteView.id,
      }
      this.props.deleteSiteView( input );
    }
  };

  handleCopy = () => {
    const { siteView, site } = this.props;
    const copiedName = `${siteView.name}copy`;
    const copiedUrl = `${siteView.url}copy`;
    let input = {
      name: copiedName,
      url: copiedUrl,
      default: false,
      siteId: site.id,
      siteViewId: siteView.id,
    }
    this.props.copySiteView(site.id, input);
  };

  renderDropDown = (siteViewUrl) => {
    if (siteViewUrl === 'default' || siteViewUrl === 'user') {
      return;
    }
    // console.log(this.props.theme);
    return (    
            <DropdownButton
              bsStyle="default"
              title="Change Type"
              key="default"
              id="dropdown-basic-default"
              style={{
                margin: '1em 1em 1em 0',
                background: this.props.theme.button,
              }}>
              {siteViewTypes.map((type) => (
                <MenuItem
                  key={type}
                  name={`set:search.type`}
                  onClick={() => this.handleChangeType(type)}>
                  {type}
                </MenuItem>
              ))}
            </DropdownButton> 
    );
  };

  render() {
    const { siteView, site, type } = this.props;

    let urlString;
    if (site.subdomain !== 'default') {
      urlString = `https://${site.subdomain}.clinwiki.org/search?sv=${siteView.url}`;
    } else {
      urlString = `https://clinwiki.org/search?sv=${siteView.url}`;
    }

    if (this.props.isReloading){
      return <BeatLoader/>
    }

    return (
      <tr>
        <td>{siteView.name}</td>
        <td>{siteView.url}</td>
        {type === 'search' && (
          <td>
                <Checkbox
                  checked={siteView.default}
                  onChange={() => this.handleCheckbox()}
                />
          </td>
        )}
        <td>
          <a target="_blank" href={urlString} rel="noopener noreferrer">
            {urlString}
          </a>
        </td>
        <td>
          <StyledButton onClick={this.handleEditClick}>Edit</StyledButton>
              <StyledButton onClick={() => this.handleCopy()}>
                Copy
              </StyledButton>
              <StyledButton onClick={() => this.handleDelete()}>
                Delete
              </StyledButton>
          {this.renderDropDown(siteView.url)}
        </td>
      </tr>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchSiteProvider: (id?, url?) => dispatch(fetchSiteProvider(id, url)),
  copySiteView: (id, input) => dispatch(copySiteView(id, input)),
  updateSiteView: (id, input) => dispatch(updateSiteView(id, input)),
  deleteSiteView: (input) => dispatch(deleteSiteView(input))
})

const mapStateToProps = (state, ownProps) => ({
  isReloading: state.site.isFetchingSiteProvider,
})

export default connect(mapStateToProps, mapDispatchToProps) (withRouter(SiteViewItem));
