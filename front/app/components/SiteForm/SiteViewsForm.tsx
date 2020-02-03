// import * as React from "react";
// import styled from "styled-components";
// import { gql } from "apollo-boost";
// import { SiteViewFragment } from "types/SiteViewFragment";
// import CollapsiblePanel from "components/CollapsiblePanel";
// import { StyledContainer, StyledLabel } from "./Styled";
// import { SiteViewItem } from "components/SiteItem";
// import {
//   updateView,
//   createMutation,
//   getViewValueByPath
// } from "utils/siteViewUpdater";
// import { Switch, Route, match, Redirect } from "react-router";
// import {
//   Checkbox,
//   Row,
//   Col,
//   Button,
//   Table,
//   FormControl
// } from "react-bootstrap";
// import { History, Location } from "history";
// import { CreateSiteViewInput, SiteViewMutationInput } from "types/globalTypes";
// import StyledButton from "containers/LoginPage/StyledButton";
// import CreateSiteViewMutation, {
//   CreateSiteViewMutationFn
// } from "mutations/CreateSiteViewMutation";

// interface SiteViewsFormProps {
//   siteViews: SiteViewFragment[];
//   onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
// }

// interface SiteViewsFormState {
//   form: {
//     siteName: string | null;
//     siteURL: string | null;
//   };
// }

// const SiteViewsTable = styled.div`
//   display: flex;
// `;

// class SiteViewsForm extends React.Component<
//   SiteViewsFormProps,
//   SiteViewsFormState
// > {
//   state: SiteViewsFormState = {
//     form: {
//       siteName: null,
//       siteURL: null
//     }
//   };

//   // handleSave = (createSiteView: CreateSiteViewMutationFn) => (
//   //   input: CreateSiteViewInput,
//   //   mutations: SiteViewMutationInput[]
//   // ) => {
//   //   createSiteView({ variables: {input}}).then(res => {

//   //   })
//   // };

//   handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({
//       form: { ...this.state.form, [e.target.name as any]: e.target.value }
//     });
//   };

//   render() {
//     const { siteViews } = this.props;
//     console.log(siteViews);
//     return (
//       <StyledContainer>
//         <CollapsiblePanel header="My Site Views">
//           {siteViews.length > 0 && (
//             <Table striped bordered condensed>
//               <thead>
//                 <tr>
//                   <th>Site Name</th>
//                   <th>URL</th>
//                   <th />
//                 </tr>
//               </thead>
//               <tbody>
//                 <>
//                   {siteViews.map(view => (
//                     <SiteViewItem siteView={view} />
//                   ))}
//                 </>
//                 <tr>
//                   <td>
//                     <FormControl
//                       name="siteName"
//                       placeholder="Site Name"
//                       value={this.state.form.siteName}
//                       onChange={this.handleInputChange}
//                     />
//                   </td>
//                   <td>
//                     <FormControl
//                       name="siteURL"
//                       placeholder="Site URL"
//                       value={this.state.form.siteURL}
//                       onChange={this.handleInputChange}
//                     />
//                   </td>
//                   <td>
//                     <StyledButton onClick={() => console.log(this.state.form)}>
//                       + Add Site View
//                     </StyledButton>
//                   </td>
//                 </tr>
//               </tbody>
//             </Table>
//           )}
//         </CollapsiblePanel>
//       </StyledContainer>
//     );
//   }
// }

// export default SiteViewsForm;
