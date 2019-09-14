// import React from 'react';
// import FontAwesome from 'react-fontawesome';
// import { Button, Form, FormGroup, FormControl } from 'react-bootstrap';
// import { withClientState } from '../../components/Apollo/LocalStateDecorator';

// interface SearchInputProps {
//   onSearchChange: (q: string) => void;
// }

// interface SearchInputState {
//   query: string | null;
// }

// class SearchInput extends React.Component<SearchInputProps, SearchInputState> {
//   state: SearchInputState = { query: null };

//   constructor(props) {
//     super(props);
//     this.onSearchChange = this.onSearchChange.bind(this);
//     this.onSubmit = this.onSubmit.bind(this);
//   }

//   onSearchChange(e) {
//     this.query = e.target.value;
//   }

//   onSubmit(e) {
//     e.preventDefault();
//     let searchQuery = [this.query];
//     if (this.query == null || this.query == undefined) {
//       searchQuery = this.props.clientState.searchQuery.slice(0, 1);
//     }
//     this.props.updateClientState({ searchQuery });
//   }

//   render() {
//     let q =
//       this.props.clientState && this.props.clientState.searchQuery.slice(0, 1);
//     return (
//       <Form inline onSubmit={this.onSubmit} className="searchInput">
//         <FormGroup controlId="formInlineEmail">
//           <FormControl
//             style={{ width: '80%', position: 'relative', left: -10 }}
//             type="text"
//             defaultValue={q}
//             placeholder={q || 'search...'}
//             onChange={this.onSearchChange}
//           />
//           <Button type="submit">
//             <FontAwesome name="search" />
//           </Button>
//         </FormGroup>
//       </Form>
//     );
//   }
// }

// export default withClientState(SearchInput);
