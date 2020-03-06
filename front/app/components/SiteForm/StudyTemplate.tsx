import * as React from 'react';
import MailMerge from 'components/MailMerge/MailMerge'
import StudySchema from 'components/MailMerge/StudySchema'

interface Props {
  template? : string;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
}

interface State {
  nct_id? : string
}

class StudyTemplate extends React.Component<Props, State> {

  render() {
    return ( 
    <div>

    </div>)
  }
}

export default StudyTemplate;