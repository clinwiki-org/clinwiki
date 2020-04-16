import * as React from 'react';
import {
  WikiPageEditFragment,
} from 'types/WikiPageEditFragment';
<<<<<<< HEAD
import StyleWrapper from "./StyleWrapper";
import Edit from "./Edit";

=======
import { gql } from 'apollo-boost';
import withTheme from '../../containers/ThemeProvider';
>>>>>>> auth header styles coming from theme

interface EditsProps {
  edits: WikiPageEditFragment[];
}

<<<<<<< HEAD
class Edits extends React.Component<EditsProps> {
=======
// these are the styles provided by diffy, btw
const StyleWrapper = styled(Table)`
  .diff {
    overflow: auto;
  }
  .diff ul {
    background: none;
    overflow: auto;
    font-size: 13px;
    list-style: none;
    margin: 0;
    padding: 0;
    display: table;
    width: 100%;
  }
  .diff del,
  .diff ins {
    display: block;
    text-decoration: none;
  }
  .diff li {
    padding: 0;
    display: table-row;
    margin: 0;
    height: 1em;
  }
  .diff li.ins {
    background: #dfd;
    color: #080;
  }
  .diff li.del {
    background: #fee;
    color: #b00;
  }
  .diff li:hover {
    background: #ffc;
  }
  /* try 'whitespace:pre;' if you don't want lines to wrap */
  .diff del,
  .diff ins,
  .diff span {
    white-space: pre-wrap;
    font-family: courier;
  }
  .diff del strong {
    font-weight: normal;
    background: #fcc;
  }
  .diff ins strong {
    font-weight: normal;
    background: #9f9;
  }
  .diff li.diff-comment {
    display: none;
  }
  .diff li.diff-block-info {
    background: none repeat scroll 0 0 gray;
  }
`;

const ThemedStyleWrapper = withTheme(StyleWrapper);

class Edits extends React.PureComponent<EditsProps> {
  static fragment = gql`
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
    }
  `;

  getName = (user: WikiPageEditFragment_user | null) => {
    if (!user) return 'Anonymous';
    if (user.firstName) {
      return `${user.firstName} ${user.lastName && user.lastName[0]}`;
    }
    return user.email;
  };

>>>>>>> auth header styles coming from theme
  render() {
    const { edits } = this.props
    return (
      <StyleWrapper striped bordered>
        <tbody>
          {edits.map((edit, i) => (
            <Edit key={i} edit={edit} />
          ))}
        </tbody>
      </StyleWrapper>
    );
  }
}

export default Edits;
