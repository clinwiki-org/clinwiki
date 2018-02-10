/**
 *
 * Asynchronously loads the component for LoginSignupPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
