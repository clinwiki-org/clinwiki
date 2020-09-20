import * as React from 'react';

interface EditsExpansionContextType {
  historyExpanded?: any;
  setHistoryExpanded?: any;
}

const context: EditsExpansionContextType = {
  historyExpanded: {},
  setHistoryExpanded: () => {},
};

const EditsExpansionContext = React.createContext(context);

export default EditsExpansionContext;
