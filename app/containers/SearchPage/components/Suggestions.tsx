import * as React from 'react';

interface SuggestionsProps {

}


export default class Suggestions extends React.PureComponent<SuggestionsProps>{


        render() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               	
		let options = ['aids','alzheimers', 'cancer', 'diabetes','heart', 'lung', 'pancreas', 'respiratory', 'stroke'];
		//const options = loadFile()
		return (
		<datalist id='medical'>
            {options.map( (option) => {
            	return <option key={options.indexOf(option)}> {option} </option>;
            }
            	)}
          </datalist>

			);
		}
}
                                                                                                                                                                                                      