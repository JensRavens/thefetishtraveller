/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TravelPlansQuery
// ====================================================

export interface TravelPlansQuery_user_events_nodes_hero {
  __typename: "Image";
  medium: string;
}

export interface TravelPlansQuery_user_events_nodes_location {
  __typename: "Location";
  id: string;
  name: string;
  city: string | null;
  countryCode: string;
}

export interface TravelPlansQuery_user_events_nodes {
  __typename: "Event";
  id: string;
  name: string;
  slug: string;
  categories: string[];
  liked: boolean;
  startAt: ISO8601DateTime;
  endAt: ISO8601DateTime;
  fullDay: boolean;
  hero: TravelPlansQuery_user_events_nodes_hero | null;
  location: TravelPlansQuery_user_events_nodes_location;
}

export interface TravelPlansQuery_user_events {
  __typename: "EventConnection";
  /**
   * A list of nodes.
   */
  nodes: (TravelPlansQuery_user_events_nodes | null)[] | null;
}

export interface TravelPlansQuery_user {
  __typename: "User";
  name: string;
  events: TravelPlansQuery_user_events;
}

export interface TravelPlansQuery {
  /**
   * Info about a specific user
   */
  user: TravelPlansQuery_user | null;
}

export interface TravelPlansQueryVariables {
  id: string;
}
