import * as React from 'react';
import { FieldDisplay } from 'types/globalTypes';

interface CustomDropDownProps {
  value: string | number;
  display: FieldDisplay;
  docCount: number;
}

class CustomDropDown extends React.Component<CustomDropDownProps> {
  render() {

    return (
    <div>
      Custom Drop Down
    </div>
    );
  }
}

export default CustomDropDown;