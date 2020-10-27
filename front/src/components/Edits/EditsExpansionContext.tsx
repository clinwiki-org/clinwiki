import * as React from 'react';

interface EditsExpansionContextType {
  historyExpanded: Record<number, boolean>;
  setHistoryExpanded: (state: Record<number, boolean>) => void;
}

const context: EditsExpansionContextType = {
  historyExpanded: {},
  setHistoryExpanded: ({}) => {},
};

const EditsExpansionContext = React.createContext(context);

export default EditsExpansionContext;
