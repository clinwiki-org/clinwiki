import * as React from 'react';

interface ExpansionContextType {
  historyExpanded?: any;
  toggleEditVisibility?: any;
}

const context: ExpansionContextType = {
  historyExpanded: {},
  toggleEditVisibility: () => {},
};

const ExpansionContext = React.createContext(context);

export default ExpansionContext;
