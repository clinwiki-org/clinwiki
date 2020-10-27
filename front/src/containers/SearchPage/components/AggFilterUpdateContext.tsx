import * as React from 'react';
import AggFilterInputUpdater from './AggFilterInputUpdater';

interface ContextProps {
  updater: AggFilterInputUpdater | null;
}

const AggContext = React.createContext<Partial<ContextProps>>({
  updater: null,
});

export const withAggContext = Component => props => (
  <AggContext.Consumer>
    {({ updater }) => <Component updater={updater} {...props} />}
  </AggContext.Consumer>
);

export default AggContext;
