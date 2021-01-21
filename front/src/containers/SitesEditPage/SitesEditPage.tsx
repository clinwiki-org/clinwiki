import * as React from 'react';
import SiteForm from 'components/SiteForm/SiteForm';
import { UpdateSiteInput } from 'services/site/model/InputTypes';
import { match } from 'react-router';
import SiteProvider from 'containers/SiteProvider';
import { History, Location } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { updateSite } from 'services/site/actions';

interface SitesEditPageProps {
  match: match<{ id: string }>;
  history: History;
  location: Location;
}

const SitesEditPage = ({match, history, location} : SitesEditPageProps) => {
  const dispatch = useDispatch();
  const isUpdating = useSelector((state : RootState ) => state.site.isUpdatingSite)

  const handleSave = (input: UpdateSiteInput) => {
      let finalInput = { ...input, id: parseInt(match.params.id, 10) }
      dispatch(updateSite(finalInput));
      if (!isUpdating) {
        history.push('/sites')}
  };

    return (
      <SiteProvider id={parseInt(match.params.id, 10)}>
        {(site) => (
                  <SiteForm
                    match={match}
                    history={history}
                    location={location}
                    site={site}
                    onSaveSite={input => handleSave(input)}
                    //onSaveSiteView={updateSiteView}
                  />
        )}
      </SiteProvider>
    );
}

export default SitesEditPage;
