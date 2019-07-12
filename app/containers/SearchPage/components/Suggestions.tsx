import * as React from 'react';

interface SuggestionsProps {

}

class Suggestions extends React.PureComponent<SuggestionsProps> {
  render() {
    const options = ['aids', 'alzheimers', 'cancer', 'diabetes', 'heart', 'lung', 'pancreas', 'respiratory', 'stroke'];
    // const options = loadFile()
    return (
      <datalist id="medical">
        {options.map((option) => <option key={options.indexOf(option)}> {option} </option>)}
      </datalist>

    );
  }
}

export default Suggestions;
