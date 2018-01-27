/**
 *
 * Asynchronously loads the component for ClinwikiHeader
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
