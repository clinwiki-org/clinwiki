import * as React from 'react';
import { SearchParams } from '../shared';

interface ContextProps {
  searchParams: SearchParams | any;
  updateSearchParams: any;
}

const SearchParamsContext = React.createContext<Partial<ContextProps>>({
  updateSearchParams: () => {},
});

export const withSearchParams = Component => props => (
  <SearchParamsContext.Consumer>
    {({ searchParams, updateSearchParams }) => (
      <Component
        searchParams={searchParams}
        updateSearchParams={updateSearchParams}
        {...props}
      />
    )}
  </SearchParamsContext.Consumer>
);

export default SearchParamsContext;
