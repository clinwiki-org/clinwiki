import * as React from "react";
import gql from "graphql-tag";
import WikiPage from "containers/WikiPage";

const WikiPageEditFragment = gql`
  fragment WikiPageEditFragment on WikiPageEdit {
    user {
      id
      firstName
      lastName
      email
    }
    createdAt
    id
    comment
    diff
    diffHtml
    changeSet {
      bodyChanged
      frontMatterChanged
      editLines {
        status
        content
        frontMatter
        body
      }
    }
  }
`;

export default WikiPageEditFragment;
