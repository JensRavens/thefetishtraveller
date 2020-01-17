/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ToggleLike
// ====================================================

export interface ToggleLike_toggleLike_event {
  __typename: "Event";
  id: string;
  liked: boolean;
}

export interface ToggleLike_toggleLike {
  __typename: "ToggleLikePayload";
  event: ToggleLike_toggleLike_event;
}

export interface ToggleLike {
  toggleLike: ToggleLike_toggleLike | null;
}

export interface ToggleLikeVariables {
  eventId: string;
  like: boolean;
}
