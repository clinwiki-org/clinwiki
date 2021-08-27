import * as React from 'react';
import SiteForm from 'components/SiteForm/SiteForm';
import { CreateSiteInput } from 'services/site/model/InputTypes';
import SiteProvider from 'containers/SiteProvider';
import { pathOr } from 'ramda';
import { History, Location } from 'history';
import { match } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
// import { createSite } from 'services/site/actions';


interface SitesNewPageProps {
  match: match<{}>;
  history: History;
  location: Location;
}

const SitesNewPage = ({match, history, location} : SitesNewPageProps) => {
  const dispatch = useDispatch();
  const isCreating = useSelector((state : RootState ) => state.site.isCreatingSite)

  const handleSave = (input: CreateSiteInput) => {
      // dispatch(createSite(input));
      if (!isCreating) {
        history.push('/sites')}
  };
    return (
      <SiteProvider id={0}>
        {site => (
              <SiteForm
                history={history}
                location={location}
                match={match}
                site={{ ...site, name: '' }}
                onSaveSite={input => handleSave(input)}
                updateSiteView={console.log("change me")}
              />
            )
        }
      </SiteProvider>
    );
}

export default SitesNewPage;
