/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EventSearchQuery
// ====================================================

export interface EventSearchQuery_events_nodes_hero {
  __typename: "Image";
  medium: string;
}

export interface EventSearchQuery_events_nodes_location {
  __typename: "Location";
  id: string;
  name: string;
  city: string | null;
  countryCode: string;
}

export interface EventSearchQuery_events_nodes {
  __typename: "Event";
  id: string;
  name: string;
  slug: string;
  categories: string[];
  liked: boolean;
  startAt: ISO8601DateTime;
  endAt: ISO8601DateTime;
  fullDay: boolean;
  hero: EventSearchQuery_events_nodes_hero | null;
  location: EventSearchQuery_events_nodes_location;
}

export interface EventSearchQuery_events {
  __typename: "EventConnection";
  /**
   * A list of nodes.
   */
  nodes: (EventSearchQuery_events_nodes | null)[] | null;
}

export interface EventSearchQuery {
  /**
   * Search for events
   */
  events: EventSearchQuery_events;
}
