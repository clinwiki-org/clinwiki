/**
 *
 * Asynchronously loads the component for ReviewsSection
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
