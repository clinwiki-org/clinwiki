/**
 *
 * Asynchronously loads the component for ReviewSummary
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
