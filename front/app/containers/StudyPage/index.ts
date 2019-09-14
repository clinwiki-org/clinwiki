import * as Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./StudyPage'),
  loading: () => null,
});
