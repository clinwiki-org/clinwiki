export interface ReactionsById_me_reactions_reactionKind {
  __typename: "ReactionKind";
  /**
   * Id
   */
  id: number;
  /**
   * Name of reaction example is like or dislike
   */
  name: string;
}

export interface ReactionsById_me_reactions_study {
  __typename: "Study";
  briefTitle: string;
}

export interface ReactionsById_me_reactions {
  __typename: "Reaction";
  /**
   * id of reaction kind
   */
  reactionKindId: number;
  /**
   * Type of reaction such as downvote
   */
  reactionKind: ReactionsById_me_reactions_reactionKind;
  study: ReactionsById_me_reactions_study;
  nctId: string;
}
export interface ReactionsById_me {
  __typename: "User";
  /**
   * Id
   */
  id: number;
  /**
   * Email
   */
  email: string;
  /**
   * First name
   */
  firstName: string | null;
  /**
   * Last name
   */
  lastName: string | null;
  reactions: ReactionsById_me_reactions[] | null;
}

export interface ReactionsById {
  /**
   * Current logged in user
   */
  me: ReactionsById_me | null;
}

export interface ReactionsByIdVariables {
  reactionKindId: string;
}

