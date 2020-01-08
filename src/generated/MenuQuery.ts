/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MenuQuery
// ====================================================

export interface MenuQuery_me {
  __typename: "User";
  hasEvents: boolean;
}

export interface MenuQuery {
  /**
   * Information about the logged in user
   */
  me: MenuQuery_me | null;
}
