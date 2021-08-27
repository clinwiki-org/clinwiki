import * as React from 'react';
import SiteForm from 'components/SiteForm/SiteForm';
import { UpdateSiteInput } from 'services/site/model/InputTypes';
import { match } from 'react-router';
import SiteProvider from 'containers/SiteProvider';
import { History, Location } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { updateSiteHasura } from 'services/hasuraSite/actions';
import { snakeCase } from '../../utils/helpers';

interface SitesEditPageProps {
  match: match<{ id: string }>;
  history: History;
  location: Location;
}

const SitesEditPage = ({match, history, location} : SitesEditPageProps) => {
  const dispatch = useDispatch();
  const isUpdating = useSelector((state : RootState ) => state.site.isUpdatingSite)

  const handleSave = async (input: any) => {
      //console.log(input);
      let finalInput = { ...input, id: parseInt(match.params.id, 10) }
      //console.log("finalInput= ", finalInput);
      const finalInput2 = await replaceKeys(finalInput);
      //console.log('finalInput2 = ', finalInput2);
      dispatch(updateSiteHasura(finalInput2));
      if (!isUpdating) {
        history.push('/sites')}
  };

  const replaceKeys = async (x) => {
    let newObject = {};
    for(var camel in x) {
      newObject[snakeCase(camel)] = x[camel];
      //console.log(newObject);
    }
    //console.log(newObject);
    return newObject;
  }
//console.log(`sitesEditPage: ${match.params.id}`);
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
                    updateSiteView={console.log('cahnge me')}
                  />
        )}
      </SiteProvider>
    );
}

export default SitesEditPage;
