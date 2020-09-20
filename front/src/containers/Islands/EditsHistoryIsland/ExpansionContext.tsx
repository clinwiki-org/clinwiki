import React from 'react';

interface ExpansionContextType {
  historyExpanded?: any;
  setHistoryExpanded?: any;
}

const context: ExpansionContextType = {
  historyExpanded: {},
  setHistoryExpanded: () => {},
};

const ExpansionContext = React.createContext(context);

export default ExpansionContext;
