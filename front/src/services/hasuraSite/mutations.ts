export const UPDATE_SITE_MUTATION = `                                               
  mutation UpdateSiteMutation($id: bigint, $name: String, $subdomain: String!, $hide_donation, :Boolean, $reactions_config: String!, $skip_landing: Boolean, $themes: String!, $user_rank: String!, $url: String) {             
    update_sites(where: {id: {_eq: $id}}, _set: {name: $name, subdomain: $subdomain, hide_donation: $hide_donation, reactions_config: $reactions_config, skip_landing: $skip_landing, themes: $themes, user_rank: $user_rank}) {
      returning {
        id
        name
        subdomain
        hide_donation
        reactions_config
        skip_landing
        themes
        user_rank
      }
    }                                                             
  }                                                                                                                                                   
`;                   

// export const UPDATE_SITE_MUTATION = `                                               
//   mutation UpdateSiteMutation($id: bigint, $name: String) {             
//     update_sites(where: {id: {_eq: $id}}, _set: {name: $name}) {
//       returning {
//         id
//         name
//       }
//     }                                                             
//   }                                                                                                                                                   
// `;                   
