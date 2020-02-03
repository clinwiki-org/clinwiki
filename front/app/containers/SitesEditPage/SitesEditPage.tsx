import * as React from "react";
import SiteForm from "components/SiteForm/SiteForm";
import UpdateSiteMutation, {
  UpdateSiteMutationFn
} from "mutations/UpdateSiteMutation";
import {
  UpdateSiteInput,
  CreateSiteInput,
  SiteViewMutationInput
} from "types/globalTypes";
import { match } from "react-router";
import SiteProvider from "containers/SiteProvider";
import UpdateSiteViewMutation, {
  UpdateSiteViewMutationFn
} from "mutations/UpdateSiteViewMutation";
import { SiteFragment } from "types/SiteFragment";
import { serializeMutation } from "utils/siteViewUpdater";
import { History, Location } from "history";

interface SitesEditPageProps {
  match: match<{ id: string }>;
  history: History;
  location: Location;
}

class SitesEditPage extends React.PureComponent<SitesEditPageProps> {
  handleSave = (
    updateSite: UpdateSiteMutationFn,
    updateSiteView: UpdateSiteViewMutationFn,
    site: SiteFragment
  ) => (input: CreateSiteInput, mutations: SiteViewMutationInput[]) => {
    updateSite({
      variables: {
        input: { ...input, id: parseInt(this.props.match.params.id, 10) }
      }
    });
    updateSiteView({
      variables: {
        input: {
          mutations: mutations.map(serializeMutation),
          id: site.siteView.id,
          name: "Default",
          url: "",
          default: true
        }
      }
    });
  };

  render() {
    return (
      <SiteProvider id={parseInt(this.props.match.params.id, 10)}>
        {(site, refetch) => (
          <UpdateSiteViewMutation
            onCompleted={() => this.props.history.push("/sites")}
          >
            {updateSiteView => (
              <UpdateSiteMutation>
                {updateSite => (
                  <SiteForm
                    match={this.props.match}
                    history={this.props.history}
                    location={this.props.location}
                    refresh={refetch}
                    site={site}
                    onSave={this.handleSave(updateSite, updateSiteView, site)}
                  />
                )}
              </UpdateSiteMutation>
            )}
          </UpdateSiteViewMutation>
        )}
      </SiteProvider>
    );
  }
}

export default SitesEditPage;
